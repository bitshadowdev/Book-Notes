import type { SubmitHandler } from "react-hook-form";
import type { ModalNewNoteInputs, Note } from "./types";
import { appendItemToCollection, createCollection, deleteItemInCollection, existCollection, getCollection, imageToBase64, updateItemInCollection } from "./stores/database";
import useGlobalStore from "./stores/globalStore";
import { useEffect } from "react";

export const useInitApplication = () => {
  // Fetch notes
  useEffect(() => {
    const notes = getCollection<Note[]>('notes');
    useGlobalStore.setState({ notes });
  }, []);

  const isNewNoteModalOpen = useGlobalStore((state) => state.createNoteModalOpen);

  const openModal = () => {
    useGlobalStore.setState({ createNoteModalOpen: true });
  }

  const isOnEditMode = useGlobalStore((state) => state.isOnEditMode);

  const notes = useGlobalStore((state) => state.notes);
  const areNotes = notes.length > 0;
  
  return {
    isNewNoteModalOpen,
    openModal,
    isOnEditMode,
    areNotes,
    notes,
  }
}

export const handleAddNewNoteSubmit: SubmitHandler<ModalNewNoteInputs> = async (data: ModalNewNoteInputs, event: React.FormEvent) => {
    event.preventDefault();
    console.log(data);
    
    const note: Note = {
      title: data.bookTitle,
      description: data.bookDescription,
      image: await imageToBase64(data.bookImage[0]),
      content: [],
    }
    
    if (!existCollection('notes')) createCollection('notes')
    appendItemToCollection('notes', note)
    
    // Update the state
    useGlobalStore.setState({ createNoteModalOpen: false });
    useGlobalStore.setState({ isOnEditMode: true });
    useGlobalStore.setState({ notes: getCollection('notes') });
    useGlobalStore.setState({ selectedNote: note });
    useGlobalStore.setState({ editingdNoteId: useGlobalStore.getState().notes.length - 1 })
}

export const handleNewNoteEdit: SubmitHandler<ModalNewNoteInputs> = async (data: ModalNewNoteInputs, event: React.FormEvent) => {
  const editingdNoteId = useGlobalStore.getState().editingdNoteId;
  const selectedNote = useGlobalStore.getState().notes[editingdNoteId]
  
  // Check if is an image
  let image = undefined;
  if (data.bookImage.length > 0) {
    image = await imageToBase64(data.bookImage[0])
  
  }

  const note: Note = {
    title: data.bookTitle,
    description: data.bookDescription,
    image: image ? image : selectedNote.image,
  }

  updateItemInCollection('notes', editingdNoteId, note)
  useGlobalStore.setState({ editingdNoteId: editingdNoteId, createNoteModalOpen: false, newNoteModalEditMode: false, notes: getCollection<Note[]>('notes') });
}

export const handleDeleteNote = async () => {
  const editingdNoteId = useGlobalStore.getState().editingdNoteId;

  deleteItemInCollection('notes', editingdNoteId)
  useGlobalStore.setState({ createNoteModalOpen: false, notes: getCollection<Note[]>('notes') });

}

type handleEditorSignature = {
  index?: number;
}

export const handleOpenEditor = async ({ index }: handleEditorSignature) => {
  console.log(index)
  const selectedNoteId = index !== undefined ? index : useGlobalStore.getState().editingdNoteId;
  const editingNote = useGlobalStore.getState().notes[selectedNoteId]
  console.log(selectedNoteId)
  
  useGlobalStore.setState({ isOnEditMode: true });
  useGlobalStore.setState({ selectedNote: editingNote });
  useGlobalStore.setState({ editingdNoteId: selectedNoteId });
}