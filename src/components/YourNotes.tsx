import { useRef } from 'react'
import { type YourNotesProps } from '../types'
import ContextMenu, { ContextMenuButton } from './ContextMenu';
import { makeContextDriver } from '../lib';
import { motion } from 'framer-motion';

const containerVariants = {
  hidden: { opacity: 1 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: {  opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.5
    }
  }
};


function YourNotes({ notes, onEditNote, onDeleteNote, onOpenEditor }: YourNotesProps) {
  const contextMenuRef = useRef<HTMLDivElement>(null);
  const onContextClick = makeContextDriver(contextMenuRef);

  return (
    <div>
      <ContextMenu ref={contextMenuRef}>
        <ContextMenuButton style="primary" onClick={() => onOpenEditor(-1)}>Abrir en el editor</ContextMenuButton>
        <ContextMenuButton style='primary' onClick={() => onEditNote()}>Editar entrada</ContextMenuButton>
        <ContextMenuButton style='danger' onClick={() => onDeleteNote()}>Eliminar</ContextMenuButton>
      </ContextMenu>
      
      <motion.main 
        className="grid grid-cols-6 w-[80vw] p-4 gap-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {notes.map((note, index) => (
          <motion.article 
            key={`note-${index}`} 
            id="note"
            data-testid={`note-${index}`}
            className='group hover:cursor-pointer'
            onContextMenu={onContextClick}
            data-testId={index}
            onClick={() => onOpenEditor(index)}
            variants={itemVariants}
          >
            <header data-testId={index}>
              <figure className='mb-2' data-testId={index} >
                <img data-testId={index} className='p-2 border-2 border-gray-200 w-[150px] h-[200px] ' src={note.image ?
                  note.image instanceof ArrayBuffer ? URL.createObjectURL(new Blob([note.image])) :
                  note.image : ''} alt={`${note.title} Book Image`} />
              </figure>
              <h1 data-testId={index} className='text-xl bold group-hover:text-blue-300'>{note.title}</h1>
            </header>
          </motion.article>
        ))}
      </motion.main>
    </div>
  )
}

export default YourNotes;