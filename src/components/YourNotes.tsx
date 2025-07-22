import React, { useEffect, useRef, type PropsWithChildren} from 'react'
import { type Note } from '../types'
import useGlobalStore from '../stores/globalStore';

type YourNotesProps = {
  notes: Note[];
  onEditNote: () => void;
  onDeleteNote: () => void;
  onOpenEditor: (index?: number) => void;
};

type ContextMenu = {
  ref: React.RefObject<HTMLElement>;
  
}

type CtxMenuButtonProps = {
  onClick?: () => void;
  style: 'primary' | 'danger';
}

function ContextMenuButton({ children, onClick, style }: PropsWithChildren<CtxMenuButtonProps>) {
  
  const s = style === 'primary' ? 'p-2 hover:text-blue-500' : 'p-2 hover:text-red-500' 
  
  return (
    <li
      onClick={onClick}
      className={s}
      id="context-menu"
    >
      {children}
    </li>
  )
}

function ContextMenu({ref, children}: PropsWithChildren<ContextMenu>) {
  const contextMenuVisibility = useGlobalStore((state) => state.contextMenuVisibility)


  return (
          <section id="context-menu" 
            className='bg-gray-800 border-2 border-gray-700 rounded-md p-4 w-[20%] absolute top-0 left-0'
            ref={ref}
            style={{visibility: contextMenuVisibility ? 'visible' : 'hidden'}}
          >
            <ul id="menu-options">
              { children }
            </ul>
          </section>
  )
}

function YourNotes({ notes, onEditNote, onDeleteNote, onOpenEditor }: YourNotesProps) {
  const contextMenuRef = useRef<HTMLDivElement>(null);

  function onContextClick(e: React.MouseEvent<HTMLDivElement>) {
    e.preventDefault();
    e.stopPropagation();

    const ctxMenuElement = contextMenuRef.current;
    const isMenuVisible = ctxMenuElement?.style.visibility === 'visible';
    if (isMenuVisible) {
      useGlobalStore.setState({ contextMenuVisibility: false })
      return;
    }

    if (!ctxMenuElement) return;

    useGlobalStore.setState({ contextMenuVisibility: true })

    const clickX = e.clientX;
    const clickY = e.clientY;

    const translateX = clickX
    const translateY = clickY

    ctxMenuElement.style.transform = `translate(${translateX}px, ${translateY}px)`;
    

    requestAnimationFrame(() => { // O usa setTimeout(() => { ... }, 0)
        ctxMenuElement.style.visibility = 'visible';
    });

    const editingNoteId = document.elementFromPoint(clickX, clickY)?.getAttribute('data-testid');
    console.log(document.elementFromPoint(clickX, clickY))
    if (editingNoteId) {
      useGlobalStore.setState({ editingdNoteId: Number(editingNoteId) })
    }
  };


  return (
    <div>
      <ContextMenu ref={contextMenuRef}>
        <ContextMenuButton style="primary" onClick={() => onOpenEditor(-1)}>Abrir en el editor</ContextMenuButton>
        <ContextMenuButton style='primary' onClick={() => onEditNote()}>Editar entrada</ContextMenuButton>
        <ContextMenuButton style='danger' onClick={() => onDeleteNote()}>Eliminar</ContextMenuButton>
      </ContextMenu>
      <main className="grid grid-cols-6 w-[80vw] p-4">
      {notes.map((note, index) => (
        <article key={`note-${index}`} id="note"
          className='group hover:cursor-pointer'
          onContextMenu={onContextClick}
          data-testId={index}
          onDoubleClick={() => onOpenEditor(index)}
        >
          <header data-testId={index}>
            <figure className='mb-2' data-testId={index} >
              <img data-testId={index} className='p-2 border-2 border-gray-200' src={note.image} alt={`${note.title} Book Image`} />
            </figure>
            <h1 data-testId={index} className='text-xl bold group-hover:text-blue-300'>{note.title}</h1>
          </header>

          <p data-testId={index}><small data-testId={index} className='text-gray-600 group-hover:text-gray-500'>{note.description}</small></p>
        </article>        
      ))}
      </main>


    </div>
  )
}

export default YourNotes