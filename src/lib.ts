import type { SubmitHandler } from "react-hook-form";
import type { ModalNewNoteInputs, Note } from "./types";
import { appendItemToCollection, createCollection, deleteItemInCollection, existCollection, getCollection, imageToBase64, updateItemInCollection } from "./stores/database";
import useGlobalStore from "./stores/globalStore";


export const handleAddNewNoteSubmit: SubmitHandler<ModalNewNoteInputs> = async (data, event) => {
    event?.preventDefault();
    
    const note: Note = {
      title: data.bookTitle,
      description: data.bookDescription,
      image: await imageToBase64(data.bookImage[0]),
      content: [],
      details: {
        author: '',
        publicationDate: '',
        genre: '',
        isbn: '',
        publisher: '',
        pageNumber: '',
      }
    };
    
    if (!existCollection('notes')) createCollection('notes');
    appendItemToCollection('notes', note);
    
    // Update the state
    useGlobalStore.setState({ createNoteModalOpen: false });
    useGlobalStore.setState({ isOnEditMode: true });
    useGlobalStore.setState({ notes: getCollection('notes') });
    useGlobalStore.setState({ selectedNote: note });
    useGlobalStore.setState({ editingdNoteId: useGlobalStore.getState().notes.length - 1 });
}

export const handleNewNoteEdit: SubmitHandler<ModalNewNoteInputs> = async (data: ModalNewNoteInputs) => {
  const editingdNoteId = useGlobalStore.getState().editingdNoteId;
  const selectedNote = useGlobalStore.getState().notes[editingdNoteId];
  
  // Check if is an image
  let image = undefined;
  if (data.bookImage.length > 0) {
    image = await imageToBase64(data.bookImage[0]);
  
  }

  const note: Note = {
    title: data.bookTitle,
    description: data.bookDescription,
    image: image ? image : selectedNote.image,
    content: [],
    details: {
      author: "",
      publicationDate: "",
      genre: "",
      isbn: "",
      publisher: "",
      pageNumber: "",
    }
  };

  updateItemInCollection('notes', editingdNoteId, note);
  useGlobalStore.setState({ editingdNoteId: editingdNoteId, createNoteModalOpen: false, newNoteModalEditMode: false, notes: getCollection<Note[]>('notes') });
}

export const handleDeleteNote = async () => {
  const editingdNoteId = useGlobalStore.getState().editingdNoteId;

  deleteItemInCollection('notes', editingdNoteId);
  useGlobalStore.setState({ createNoteModalOpen: false, notes: getCollection<Note[]>('notes') });

}

export const handleOpenEditor = (index: number) => {
  console.log('Opening editor for note with index:', index);

  const selectedNoteId = index !== undefined ? index : useGlobalStore.getState().editingdNoteId;
  const editingNote = useGlobalStore.getState().notes[selectedNoteId];
  
  useGlobalStore.setState({ isOnEditMode: true });
  useGlobalStore.setState({ selectedNote: editingNote });
  useGlobalStore.setState({ editingdNoteId: selectedNoteId });
}

export const handleCloseEditor = (e: React.MouseEvent<HTMLElement>) => {
  console.log(e);
  
  useGlobalStore.setState({ isOnEditMode: false });
}



export const makeContextDriver = (contextMenuRef: React.RefObject<HTMLDivElement | null>): ((e: React.MouseEvent<HTMLDivElement>) => void) => {
  return (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (contextMenuRef) {
      const ctxMenuElement = contextMenuRef.current;
      const isMenuVisible = ctxMenuElement?.style.visibility === 'visible';
      if (isMenuVisible) {
        useGlobalStore.setState({ contextMenuVisibility: false });
        return;
      }

      if (!ctxMenuElement) return;

      useGlobalStore.setState({ contextMenuVisibility: true });

      const clickX = e.clientX;
      const clickY = e.clientY;

      const translateX = clickX;
      const translateY = clickY;

      ctxMenuElement.style.transform = `translate(${translateX}px, ${translateY}px)`;
      

      requestAnimationFrame(() => {
          ctxMenuElement.style.visibility = 'visible';
      });

      const editingNoteId = document.elementFromPoint(clickX, clickY)?.getAttribute('data-testid');
      if (editingNoteId) {
        useGlobalStore.setState({ editingdNoteId: Number(editingNoteId) });
      }
    };
  }
   

}

export function truncateWords(text: string, maxWords: number): string {
  const words = text.trim().split(/\s+/);
  
  if (words.length <= maxWords) return text;
  return words.slice(0, maxWords).join(" ") + "...";
}
