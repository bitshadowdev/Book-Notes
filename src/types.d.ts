export type CodeBlock = {
  type: string 
  content: string
}

export type Note = {
  title: string;
  description: string; 
  image: string | ArrayBuffer | null;
  content: CodeBlock[];
}

export type ModalNewNoteInputs = {
  bookTitle: string,
  bookImage: FileList,
  bookDescription: string
}