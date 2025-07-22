import useGlobalStore from '../stores/globalStore'
import CodeMirror, from '@uiw/react-codemirror'
import { vscodeDark } from '@uiw/codemirror-theme-vscode'
import { markdown, markdownLanguage } from '@codemirror/lang-markdown';
import { languages } from '@codemirror/language-data';
import { useState } from 'react';
import { updateItemInCollection } from '../stores/database';
import ReactMarkdown from 'react-markdown'

type EditorBlockProps = {
  setCode: (value: string) => void;
  code: string;
}

function MarkdownRendered({ id, children }: {   id: number, children: string}) {
  const [grouphHovered, setGrouphHovered] = useState({visibility: 'hidden'});
  const handleDelete = () => {
    const currentNoteContent = useGlobalStore((state) => state.selectedNote)?.content
    
  }
  return(
    <div onMouseEnter={() => setGrouphHovered({visibility: 'visible'})} onMouseLeave={() => setGrouphHovered({visibility: 'hidden'})} id="block" className=' group flex justify-between border-2 border-gray-800 h-15 rounded-md p-4 my-4' >
      <ReactMarkdown>{children}</ReactMarkdown>
      <section id="crud" style={grouphHovered}>
        <button className='hover:bg-gray-700 rounded-sm' title="Borrar">🗑️</button>
      </section>
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
  const content = useGlobalStore((state) => state.notes[useGlobalStore.getState().editingdNoteId].content)
  const [code, setCode] = useState('')

  const handleAltEnter = () => {
    const noteId = useGlobalStore.getState().editingdNoteId;
    const currentNote = useGlobalStore.getState().notes[noteId];
    currentNote.content.push({
      type: 'markdown',
      content: code
    });

    updateItemInCollection('notes', noteId, currentNote);
    useGlobalStore.setState({notes: [...useGlobalStore.getState().notes], selectedNote: currentNote})
    return true;
  }
  



  return (
    <div className='col-span-10 w-full h-full' onKeyDown={(event) => (event.altKey && event.key === 'Enter' && handleAltEnter() && setCode(''))}>
      <section id="editorHeader" className='flex gap-2 align-baseline p-4 border-b-2 border-gray-900'>
        <h1 className='text-xl'><span id='icon'>📃</span>{currentNote?.title}</h1>
        <small className='text-gray-500'>(editando)</small>
      </section>

      <section id="editor" className='p-8'>
        {
          content.map((item, index) => {
            if (item.type === 'markdown') {
              return <MarkdownRendered key={index} id={index} children={item.content} />
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