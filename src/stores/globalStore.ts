import { create } from 'zustand';
import type { Note } from '../types';


interface GlobalState {
  createNoteModalOpen: boolean;
  setCreateNoteModalOpen: (isOpen: boolean) => void;
  isOnEditMode: boolean;
  setIsOnEditMode: (isOpen: boolean) => void;
  notes: Note[];
  setNotes: (notes: Note[]) => void;
  selectedNote: Note | null;
  setSelectedNote: (note: Note | null) => void;
  contextMenuVisibility: boolean;
  setContextMenuVisibility: (visibility: boolean) => void;
  newNoteModalEditMode: boolean;
  setNewNoteModalEditMode: (editMode: boolean) => void;
  editingdNoteId: number;
  setEditingdNoteId: (id: number) => void;
  isMetadataBlockVisible: boolean;
  setIsMetadataBlockVisible: (isVisible: boolean) => void;
  editorSelection: number[];
  setEditorSelection: (selection: number[]) => void;
}

const useGlobalStore = create<GlobalState>((set) => ({
  createNoteModalOpen: false,
  setCreateNoteModalOpen: (isOpen) => set({ createNoteModalOpen: isOpen }),
  isOnEditMode: false,
  setIsOnEditMode: (isOpen) => set({ isOnEditMode: isOpen }),
  notes: [],
  setNotes: (notes) => set({ notes }),
  selectedNote: null,
  setSelectedNote: (note) => set({ selectedNote: note }),
  contextMenuVisibility: false,
  setContextMenuVisibility: (visibility) => set({ contextMenuVisibility: visibility }),
  newNoteModalEditMode: false,
  setNewNoteModalEditMode: (editMode) => set({ newNoteModalEditMode: editMode }),
  editingdNoteId: 0,
  setEditingdNoteId: (id) => set({ editingdNoteId: id }),
  isMetadataBlockVisible: false,
  setIsMetadataBlockVisible: (isVisible) => set({ isMetadataBlockVisible: isVisible }),
  editorSelection: [],
  setEditorSelection: (selection) => set({ editorSelection: selection })
}));


export default useGlobalStore