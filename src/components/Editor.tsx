import CodeMirror from '@uiw/react-codemirror';
import { vscodeDark } from '@uiw/codemirror-theme-vscode';
import { markdown, markdownLanguage } from '@codemirror/lang-markdown';
import { languages } from '@codemirror/language-data';
import ReactMarkdown from 'react-markdown'
import Highlighter from 'react-syntax-highlighter';
import { gruvboxDark } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import remarkGfm from 'remark-gfm';
import { handleCloseEditor,  } from '../lib';
import { useEditableTD, useEditor, useMarkdownRenderer } from '../hooks';
import ContextMenu, { ContextMenuButton } from './ContextMenu';
import type { Note, NoteDetails } from '../types';
import useGlobalStore from '../stores/globalStore';
import { getCollection, updateItemInCollection } from '../stores/database';
import { motion, AnimatePresence } from 'framer-motion';


type EditorBlockProps = {
  setCode: (value: string) => void;
  code: string;
}

type MarkdownRederedProps = {
  id: number;
  children: string;
  onDelete: (id: number) => void;
  onContextClick: (e: React.MouseEvent<HTMLDivElement>) => void;
  setMouseElementId: (id: number ) => void;
}

export function MarkdownRendered({ id, children, onDelete, onContextClick, setMouseElementId }: MarkdownRederedProps) {

  const {
    grouphHovered,
    setGrouphHovered,
    isOnEditing,
    code,
    setCode,
    handleEnterEdition,
    extensions,
    setEditingMode
  } = useMarkdownRenderer(id, children);

  return(
    <div data-testid='editorBlock-container' onMouseDown={() => setMouseElementId(id)} onMouseOut={() => setMouseElementId(-1)} 
      onContextMenu={onContextClick} onDoubleClick={() => setEditingMode()} title="Doble click para editar" onMouseEnter={() => setGrouphHovered({visibility: 'visible'})} onMouseLeave={() => setGrouphHovered({visibility: 'hidden'})} id="mdBlock" className='group border-2 border-gray-800 rounded-md p-4 my-4'  >
      <div id="editor" className='border-b border-b-gray-800 pb-4'>
        { (!isOnEditing)?  <ReactMarkdown
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
        </ReactMarkdown> : 
      <div> 
        <CodeMirror value={code} height='100%' theme={vscodeDark} 
          extensions={extensions}
          onChange={(value) => {setCode(value)}}
          onKeyDown={handleEnterEdition}
        />
        <p className='text-xs text-gray-400'
          data-testid="editing-instruction"
        > (<small>Presione <kbd>Alt</kbd>+<kbd>Enter</kbd> para dejar de editar este bloque.</small>)</p>  
      </div>}
      </div>
      
      <div id="blockActions" style={grouphHovered} className='w-full flex justify-end pt-4'>
        <button data-testid="delete-button" onClick={() => onDelete(id)} className='rounded-sm text-gray-400 hover:text-red-400 text-xs mr-2' title="Borrar">Borrar</button>
        |
        <button data-testid="edit-button" onClick={() => setEditingMode()} className='rounded-sm text-gray-400 hover:text-blue-400 text-xs ml-2' title="Editar">Editar</button>
      </div>
    </div>
  ) 
}

export function MarkdownBlock( {code, setCode}: EditorBlockProps ) {
  const extensions = [
    markdown({ base: markdownLanguage, codeLanguages: languages })
  ]

  return (
    <div>
        <CodeMirror value={code} height='100%' theme={vscodeDark} 
          extensions={extensions}
          onChange={(value) => {setCode(value)}}
          
        />
        <p data-testid='markdown-instructions' className='text-xs text-gray-400'> (<small>Presione <kbd>Alt</kbd>+<kbd>Enter</kbd> para insertar el bloque.</small>)</p>
    </div>
  )
}


export function EditableTD({ children, setter }: PropsWithChildren<{ setter: (value: string) => void }>) {
  const {
    isEditable,
    setIsEditable,
    inputValue,
    setInputValue,
    inputRef
  } = useEditableTD(children as string)

  return (
   <>
    {isEditable ? (
      <input
        ref={inputRef}
        type="text"
        value={inputValue}
        data-testId='td-input'
        onKeyUp={(e) => {
          if (e.key === 'Escape') {
            setIsEditable(false);
            setInputValue(children as string);
          }
        }}
        onChange={(e) => {
          setInputValue(e.target.value);
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            setIsEditable(false);
            setter(inputValue);
          }
        }}

        onBlur={() => {setIsEditable(false); setter(inputValue)}}
        className="w-full bg-gray-800 text-gray-200 border border-gray-700 rounded-md p-2 text-sm"
      />
    ) : (
      <span
        onClick={() => {
          setIsEditable(true)
          // focus the input
          setTimeout(() => {
            inputRef.current?.focus();
          }, 0);
        }}
        className="cursor-pointer text-gray-200 hover:text-blue-400"
        data-testId="editable-toggler"
      >
        {children ? children : <span className='text-gray-500 hover:underline' title="Haga click para editar">No hay información</span>}
      </span>
    )}
   </>
    
  )}
function MetadataBlock({ noteDetails }: { noteDetails: NoteDetails | undefined, visible: boolean, setVisible: (state: boolean) => void }) {
  const makeSetter = (key: keyof NoteDetails) => (value: string) => {
    /* Update current note */
    const currentNote = useGlobalStore.getState().selectedNote;
    if (currentNote) {
      currentNote.details[key] = value;
      updateItemInCollection('notes', useGlobalStore.getState().editingdNoteId, currentNote);
      useGlobalStore.setState({ notes: getCollection('notes') });
      useGlobalStore.setState({ selectedNote: currentNote });
    }
  }

  return (
      
      <motion.div  
        className={`border-l-2 border-b-2 border-r-2 border-gray-800 p-4 px-12 shadow-inner shadow-black`} 
        initial={{ y: -20, opacity: 0, height: 0 }}
        animate={{ y: 0, opacity: 1, height: 'auto' }}
        exit={{ y: -20, opacity: 0, height: 0 }}
        transition={{ duration: 0.5, ease: 'easeInOut' }}
      >
        <div id="title" className='flex justify-between' data-testid="metadata-root">
          <h2 className='text-lg font-semibold'>Metadatos</h2>
          <button 
            className='text-gray-500 font-bold hover:text-gray-300'
            onClick={() => {useGlobalStore.setState({isMetadataBlockVisible: false})}}>[ X ]</button>
        </div>
        <p className='text-sm text-gray-500'>Aquí puedes agregar metadatos relacionados con el libro (Solo puede haber un bloque de metadatos por nota).</p>


        <table className='w-full mt-4'>
          <thead>
            <tr>
              <th className='text-left'>Metadato</th>
              <th className='text-left'>Valor</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Fecha de publicación</td>
              <td>
                <EditableTD setter={(value) => makeSetter('publicationDate')(value)}>
                  {noteDetails.publicationDate}
                </EditableTD>
              </td>
            </tr>
            <tr>
              <td>Género</td>
              <td>
                <EditableTD setter={(value) => makeSetter('genre')(value)}>
                  {noteDetails.genre}
                </EditableTD>
              </td>
            </tr>
            <tr>
              <td>ISBN</td>
              <td>
                <EditableTD setter={(value) => makeSetter('isbn')(value)}>
                  {noteDetails.isbn}
                </EditableTD>
              </td>
            </tr>
            <tr>
              <td>Editorial</td>
              <td>
                <EditableTD setter={(value) => makeSetter('publisher')(value)}>
                  {noteDetails.publisher}
                </EditableTD>
              </td>
            </tr>
            <tr>
              <td>Número de páginas</td>
              <td>
                <EditableTD setter={(value) => makeSetter('pageNumber')(value)}>
                  {noteDetails.pageNumber}
                </EditableTD>
              </td>
            </tr>
          </tbody>
        </table>
        
      </motion.div>
  )
}

function EditorBlock( { code, setCode }: EditorBlockProps ) {
  
  return (
      <div id="block" className='border-2 border-gray-800  rounded-md ' >
        {/*
        <div id="form-control" className='flex gap-4 pb-2 px-4' >
 
          <div id="blockTypeSelectGroup" className='block'>
            <label htmlFor="blockType" className='text-xs'>Tipo de bloque</label>
            <select 
            onChange={(e) => setSelectedBlockType(e.target.value as 'md' | 'metadata')}
            name="blockType" id="blockType" className='w-full bg-gray-800 text-gray-200 border border-gray-700 rounded-md p-2 text-sm'>
              <option value="md" selected>Markdown</option>
              <option value="metadata">Metadatos</option>
            </select>
          </div>


        </div>
        */}

        <div id="blockContent" className='p-4'>
           <MarkdownBlock code={code} setCode={setCode} /> 
        </div>
        

      
      </div>
  )
}

type CellContextProps = {
  ref: React.RefObject<HTMLElement | null>;
}

function RenderedCellContextMenu({ref, children}: PropsWithChildren<CellContextProps>) {
  return (
    <ContextMenu ref={ref}>
      {children}
    </ContextMenu>
  )
}

type EditorHeader = {
  editMetadata: () => void;
  handleCloseEditor: (e: React.MouseEvent<HTMLElement>) => void;
  currentNote: Note | nulll;
}

function EditorHeader({editMetadata, handleCloseEditor, currentNote}: EditorHeader ) {
  return (
    <section id="editorHeader" className='flex gap-4 align-baseline justify-between p-4 border-b-2 border-gray-900'>
      <div id="title" className='flex gap-2'>
        <button className='text-gray-500 font-bold hover:bg-gray-700 px-2 rounded-sm'
          onClick={handleCloseEditor}
          data-testid="back-button"
        >&lt;</button>
        <h1 className='text-xl' data-testid='editor-header'><span id='icon'>📃</span>{currentNote?.title}</h1>
        <small className='text-gray-500' data-testid='editor-small'>(editando)</small>
      </div>

      <div id="options" className='px-10'>
        <button className='text-gray-500 font-bold hover:text-gray-300'
          data-testid="edit-metadata"
          onClick={editMetadata}>Editar metadatos</button>

      </div>
    </section>
  );
}

function EditorActions({ currentNote }: {currentNote: Note | undefined | null }) {
  return (
    <section data-testid="editor-actions" id="editorActions" className=''>
      {useGlobalStore.getState().isMetadataBlockVisible}
      <AnimatePresence>  
        {useGlobalStore.getState().isMetadataBlockVisible ? <MetadataBlock noteDetails={currentNote?.details}
        />: null}
      </AnimatePresence>
    </section>
  )
}

function Editor() {
  const {
    currentNote,
    content,
    code,
    setCode,
    handleAltEnter,
    handleDeleteBlock,
    contextMenuRef,
    setMouseElementId,
    contextClickOverride,
    handleCopyToClipboard,
    editMetadata
  } = useEditor();


  
  return (
    <div data-testid='general-container' className='col-span-10 w-full min-h-auto' onKeyDown={handleAltEnter}>
      <EditorHeader
        currentNote={currentNote}
        editMetadata={editMetadata}
        handleCloseEditor={handleCloseEditor} />
        <EditorActions currentNote={currentNote} />
      <section id="editor" className='p-8'>
        {
          content?.map((item, index) => {
            if (item.type === 'markdown') {
              return <MarkdownRendered setMouseElementId={setMouseElementId} 
                      onContextClick={contextClickOverride} 
                      onDelete={handleDeleteBlock} 
                      key={index} 
                      id={index} 
                      children={item.content} />
            }
            return null;
          })
        }
        <EditorBlock 
          setCode={setCode}
          code={code}
          currentNote={currentNote?.details}
        /> 
      </section>
    </div>
  )
}

export default Editor