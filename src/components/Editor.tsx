import useGlobalStore from '../stores/globalStore'
import CodeMirror, from '@uiw/react-codemirror'
import { vscodeDark } from '@uiw/codemirror-theme-vscode'
import { markdown, markdownLanguage } from '@codemirror/lang-markdown';
import { languages } from '@codemirror/language-data';
import { useState } from 'react';
import { getCollection, updateItemInCollection } from '../stores/database';
import ReactMarkdown from 'react-markdown'
import { type Note } from '../types';
import Highlighter from 'react-syntax-highlighter'
import { gruvboxDark } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import remarkGfm from 'remark-gfm';


type EditorBlockOnEditMode = {
  content: string;

}

type EditorBlockProps = {
  setCode: (value: string) => void;
  code: string;
}

function MarkdownRendered({ id, children, onDelete }: {   id: number, children: string, onDelete: (blockIndex: number) => void }) {
  const [grouphHovered, setGrouphHovered] = useState({visibility: 'hidden'});
  return(
    <div title="Doble click para editar" onMouseEnter={() => setGrouphHovered({visibility: 'visible'})} onMouseLeave={() => setGrouphHovered({visibility: 'hidden'})} id="mdBlock" className='group border-2 border-gray-800 rounded-md p-4 my-4' >
      <div id="editor" className='border-b border-b-gray-800 pb-4'>
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        code({ node, inline, className, children, ...props }) {
          const match = /language-(\w+)/.exec(className || '');
          return !inline && match ? (
            <Highlighter
              language={match[1]}
              PreTag="div" // O el tag que prefieras
              style={gruvboxDark}
              {...props}
            >
              {String(children).replace(/\n$/, '')}
            </Highlighter>
          ) : (
            <code className={className} {...props}>
              {children}
            </code>
          );
        },
      }}
    >
      {children}
    </ReactMarkdown>
      </div>
      
      <div id="blockActions" style={grouphHovered} className='w-full flex justify-end pt-4'>
        <button onClick={() => onDelete(id)} className='rounded-sm text-gray-400 hover:text-red-400 text-xs mr-2' title="Borrar">Borrar</button>
        |
        <button onClick={() => {}} className='rounded-sm text-gray-400 hover:text-blue-400 text-xs ml-2' title="Editar">Editar</button>
      </div>
    </div>
  ) 
}

function EditorBlock( {code, setCode}: EditorBlockProps ) {

  const extensions = [
    markdown({ base: markdownLanguage, codeLanguages: languages })
  ]

  return (
      <div id="block" className='border-2 border-gray-800 h-15 rounded-md ' >
        <CodeMirror value={code} height='100%' theme={vscodeDark} 
          extensions={extensions}
          onChange={(value, _) => {setCode(value)}}
        />
        <p className='text-xs text-gray-400'> (<small>Presione <kbd>Shift</kbd>+<kbd>Enter</kbd> para insertar el bloque.</small>)</p>
      </div>
  )
}

function Editor() {
  const currentNote = useGlobalStore((state) => state.selectedNote)
  const content = useGlobalStore((state) => state.selectedNote?.content)
  const [code, setCode] = useState('')
  const { selectedNote, editingdNoteId, setSelectedNote } = useGlobalStore();

  const handleAltEnter = () => {
    const noteId = useGlobalStore.getState().editingdNoteId;
    const currentNote = useGlobalStore.getState().notes[noteId];
    currentNote.content.push({
      type: 'markdown',
      content: code
    });

    
    updateItemInCollection('notes', noteId, currentNote);
    useGlobalStore.setState({notes: [...useGlobalStore.getState().notes], selectedNote: useGlobalStore.getState().notes[noteId]})
    return true;
  }
  
  const handleDeleteBlock = (blockIndexToDelete: number) => {
    if (editingdNoteId === undefined || !selectedNote) return; // Seguridad

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
    useGlobalStore.setState({notes: [...getCollection<Note[]>('notes')], })

  };


  return (
    <div className='col-span-10 w-full min-h-auto' onKeyDown={(event) => (event.altKey && event.key === 'Enter' && handleAltEnter() && setCode(''))}>
      <section id="editorHeader" className='  align-baseline p-4 border-b-2 border-gray-900'>
        <h1 className='text-xl'><span id='icon'>📃</span>{currentNote?.title}</h1>
        <small className='text-gray-500'>(editando)</small>
      </section>

      <section id="editor" className='p-8'>
        {
          content.map((item, index) => {
            if (item.type === 'markdown') {
              return <MarkdownRendered onDelete={handleDeleteBlock} key={index} id={index} children={item.content} />
            }
            return null;
          })
        }
        <EditorBlock 
          setCode={setCode}
          code={code}
        /> 
      </section>
    </div>
  )
}

export default Editor