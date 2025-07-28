export type CodeBlock = {
  type: string 
  content: string
}

/* Datos para crear citaciones en APA y otros formatos */
export type NoteDetails = {
  author: string;
  publicationDate: string;
  genre: string;
  isbn: string;
  publisher: string;
  pageNumber: string;
}

export type Note = {
  title: string;
  description: string; 
  image: string | ArrayBuffer | null;
  content: CodeBlock[];
  details: NoteDetails;
}

export type ModalNewNoteInputs = {
  bookTitle: string,
  bookImage: FileList | File[],
  bookDescription: string
}

export type handleEditorSignature = {
  index?: number;
}

export type YourNotesProps = {
  notes: Note[];
  onEditNote: () => void;
  onDeleteNote: () => void;
  onOpenEditor: (index: number) => void;
};


type useEditorReturn = {
  currentNote: Note | null;
  content: CodeBlock[] | undefined; 
  code: string;
  setCode: React.Dispatch<React.SetStateAction<string>>;
  handleAltEnter: (event: React.KeyboardEvent) => true | undefined | void;
  handleDeleteBlock: (blockIndexToDelete: number) => void;
  contextMenuRef: React.Ref<HTMLElement | null>;
  onContextClick: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
  mouseElementId: number;
  setMouseElementId: React.Dispatch<React.SetStateAction<number>>;
  contextClickOverride: (e: React.MouseEvent<HTMLDivElement>) => void;
  handleCopyToClipboard: () => void;
  editMetadata: () => void;
}


type useMarkdownRendererReturn = {
  grouphHovered: {visibility: string};
  setGrouphHovered: React.Dispatch<React.SetStateAction<{visibility: string}>>;
  isOnEditing: boolean;
  setIsOnEditing: React.Dispatch<React.SetStateAction<boolean>>;
  setCode: React.Dispatch<React.SetStateAction<string>>;
  code: string;
  handleEnterEdition: (event: React.KeyboardEvent<HTMLDivElement>) => boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  extensions: any[];
  setEditingMode: () => void;
}

type  NoNotesProps = {
  mainLine: string;
  seccondLine: string;
  icon?: React.ReactNode | undefined;
}

type NoNotesContainerProps = {
  children: React.ReactNode;
  icon?: React.ReactNode;
}