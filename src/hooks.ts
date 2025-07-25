import { useEffect, useState } from "react";
import { getCollection, updateItemInCollection } from "./stores/database";
import type { Note, useEditorReturn, useMarkdownRendererReturn } from "./types";
import useGlobalStore from "./stores/globalStore";
import { markdown, markdownLanguage } from "@codemirror/lang-markdown";
import { languages } from "@codemirror/language-data";

export const useInitApplication = () => {
  // Fetch notes
  useEffect(() => {
    const notes = getCollection<Note[]>('notes');
    useGlobalStore.setState({ notes });
  }, []);
  useGlobalStore.setState({ isMetadataBlockVisible: false });


  const isNewNoteModalOpen = useGlobalStore((state) => state.createNoteModalOpen);

  const openModal = () => {
    useGlobalStore.setState({ createNoteModalOpen: true });
  }

  const isOnEditMode = useGlobalStore((state) => state.isOnEditMode);

  const notes = useGlobalStore((state) => state.notes);

  const editingNoteId = useGlobalStore((state) => state.editingdNoteId);
  const currentNote = useGlobalStore((state) => state.notes[editingNoteId]);
  
  
  const areNotes = notes.length > 0;
  
  // Set context menu visibility to false if a left click on document is registerd 
  document.addEventListener('click', () => {
    useGlobalStore.setState({ contextMenuVisibility: false })
    const menu = document.getElementById('context-menu')
    if (menu) {menu.style.top = '0';menu.style.left = '0'};
  })

  const onEditNote = () => {
    useGlobalStore.setState({ createNoteModalOpen: true, newNoteModalEditMode: true })
  }


  return {
    isNewNoteModalOpen,
    openModal,
    isOnEditMode,
    areNotes,
    notes,
    currentNote,
    onEditNote
  }
}


export const useMarkdownRenderer = (id: number, children: string): useMarkdownRendererReturn => {
  const [grouphHovered, setGrouphHovered] = useState({visibility: 'hidden'});
  const [isOnEditing, setIsOnEditing] = useState(false);
  const [code, setCode] = useState('');
  const currentNote = useGlobalStore.getState().selectedNote;
  
  const extensions = [
    markdown({ base: markdownLanguage, codeLanguages: languages })
  ];

  const handleEnterEdition = (event: React.KeyboardEvent<HTMLDivElement>) => {
    
    if (event.key === 'Escape') {
      setIsOnEditing(false);
      return true;
    }


    if (event.altKey && event.key === "Enter") {

      const contentBlock = currentNote?.content[id];  
      if (contentBlock) {
        contentBlock.content = code;
        currentNote.content[id] = contentBlock;
      }

      updateItemInCollection('notes', useGlobalStore.getState().editingdNoteId, currentNote);
      useGlobalStore.setState({ notes: getCollection('notes') });
      useGlobalStore.setState({ selectedNote: currentNote });
      setIsOnEditing(false);
      return true;
    } else {
      return false;
    }


  }

  const setEditingMode = () => {
    // clear selection 
    const sel = window.getSelection();

    setCode(children);
    setIsOnEditing(true);
    
    if (sel && sel.removeAllRanges) {
        sel.removeAllRanges();
    } else if (sel && sel.empty) {
        sel.empty();
    }

  }

  return {
    grouphHovered,
    setGrouphHovered,
    isOnEditing,
    setIsOnEditing,
    setCode,
    code,
    handleEnterEdition,
    extensions,
    setEditingMode
  }
}



export const useEditor = (): useEditorReturn => {
  const currentNote = useGlobalStore((state) => state.selectedNote);
  const content = useGlobalStore((state) => state.selectedNote?.content);
  const [code, setCode] = useState('');
  const { selectedNote, editingdNoteId, setSelectedNote } = useGlobalStore();

  const handleAltEnter = () => {
    if (!code) return;
    const noteId = useGlobalStore.getState().editingdNoteId;
    const currentNote = useGlobalStore.getState().notes[noteId];
    currentNote.content.push({
      type: 'markdown',
      content: code
    });
    
    updateItemInCollection('notes', noteId, currentNote);
    useGlobalStore.setState({notes: [...useGlobalStore.getState().notes], selectedNote: useGlobalStore.getState().notes[noteId]});
    setCode('');
    return true;
  }
  
  const handleDeleteBlock = (blockIndexToDelete: number) => {
    if (editingdNoteId === undefined || !selectedNote) return;

    const noteId = editingdNoteId;

    // Crea una copia del contenido y elimina el bloque
    const newContent = selectedNote.content.filter((_, index) => index !== blockIndexToDelete);

    const updatedNote = {
      ...selectedNote,
      content: newContent
    };

    // Actualiza en la base de datos y en el store global
    updateItemInCollection('notes', noteId, updatedNote);
    setSelectedNote(updatedNote);
    useGlobalStore.setState({notes: [...getCollection<Note[]>('notes')], });
  };


  return {
    currentNote,
    content,
    code,
    setCode,
    handleAltEnter,
    handleDeleteBlock
  }
}
