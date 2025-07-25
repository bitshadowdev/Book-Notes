import React from 'react'
import useGlobalStore from '../stores/globalStore'
import { useForm } from 'react-hook-form'
import { type ModalNewNoteInputs as Inputs, type ModalNewNoteInputs, type Note } from '../types'


type ModalButtonProps = {
  children: React.ReactNode;
  component: 'input' | 'button';
  variant?: 'primary' | 'secondary';
  onClick?: () => void;
}


type ModalProps = {
  onCancel?: () => void;
  onEdit?: (data: ModalNewNoteInputs, event?: React.BaseSyntheticEvent) => void;
  onSubmit: (data: ModalNewNoteInputs, event?: React.BaseSyntheticEvent) => void;
}

function ModalContainer({children}: {children: React.ReactNode, open?: boolean}) {
  return (
    <div className='absolute top-[25%] left-[40vw] w-[40vw] bg-gray-900 rounded-md outline-1 outline-gray-800  '>
      {children}
    </div>
  )
}

function ModalHeader({children}: {children: React.ReactNode}) {
  const setterModal = useGlobalStore((state) => state.setCreateNoteModalOpen)
  const closeModal = () => {
    setterModal(false)
  }
  return (
    <div id="modalHeader" className='p-4 border-b-2 border-gray-700 flex justify-between'>
      <h2>{children}</h2>
      <button className='hover:text-blue-800' onClick={closeModal}>[ X ]</button>
    </div>
  )
}

function ModalFormContainer({ children }: { children: React.ReactNode }) {
  return (
    <div id="modalForm" className='p-4 border-b-2 border-gray-700'>
      {children}
    </div>
  )
}

function ModalFooter({ children }: { children: React.ReactNode }) {
  return (
    <div id="modalFooter" className='p-4 flex gap-4 justify-end'>
      {children}
    </div>
  )
}




function ModalButton({ children, variant, component, onClick } : ModalButtonProps) {
  const color = variant === 'primary' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-600 hover:bg-gray-700'
  if (component === 'input') return <input value={children as string} type='submit' className={"p-2 rounded-md " + color} />
  if (component === 'button') return (
    <button className={"p-2 rounded-md " + color} onClick={onClick}>
      {children}
    </button>
  )
}

function DefaultNewNoteModal({ onCancel, onSubmit, onEdit }: ModalProps) {

  const createNoteModalOpen = useGlobalStore((state) => state.createNoteModalOpen);
  const { register, handleSubmit, formState: { errors } } = useForm<Inputs>();
  const newNoteModalEditMode = useGlobalStore((state) => state.newNoteModalEditMode);
  const editingNoteId = useGlobalStore((state) => state.editingdNoteId);
  const allNotes = useGlobalStore((state) => state.notes);
  let note: Note | undefined = undefined;

  if (newNoteModalEditMode) {
    note = allNotes[editingNoteId];
  }

  const formHandler = newNoteModalEditMode
    ? (onEdit ?? (() => {}))
    : onSubmit;
  
  return (
    <ModalContainer open={createNoteModalOpen}>
      <ModalHeader>
        Crear una nueva nota
      </ModalHeader>

      <ModalFormContainer>
        <form onSubmit={handleSubmit(formHandler)} >
          <div className="errors">
            {errors.bookImage && <p className="text-red-500">{errors.bookImage.message}</p>}
            {errors.bookTitle && <p className="text-red-500">{errors.bookTitle.message}</p>}
            {errors.bookDescription && <p className="text-red-500">{errors.bookDescription.message}</p>}
          </div>
          <div id='form-group'>
            
            <label className='border-2 border-gray-900 '>Foto de portada</label>
            <input {...register("bookImage")} type="file" name="bookImage" id="bookImage" className="p-2 mt-1 cursor-pointer rounded-lg border-2 border-gray-900 bg-gray-800 w-full" accept='image/png, image/jpeg, image/jpg' required={newNoteModalEditMode ? false : true} />
          </div>
          <input defaultValue={newNoteModalEditMode ? note?.title : undefined} {...register("bookTitle")} name="bookTitle"  className='rounded-lg border-2 border-gray-900 bg-gray-800 p-2 w-full mt-4 cursor-text' type="text" id="libro" placeholder='Titulo del libro' required/>
          <textarea defaultValue={newNoteModalEditMode ? note?.description : undefined} {...register("bookDescription")} name="bookDescription" className='rounded-lg border-2 border-gray-900 bg-gray-800 p-2 w-full mt-4 cursor-text' placeholder='Descripción de la nota' required></textarea>
          <ModalFooter>
            <ModalButton variant='primary' component='button'> Guardar </ModalButton>
            <ModalButton onClick={onCancel} variant='secondary' component='button'> Cancelar </ModalButton>
          </ModalFooter>
          
        </form>
      </ModalFormContainer>

    </ModalContainer>
  )
}

DefaultNewNoteModal.Header = ModalHeader
DefaultNewNoteModal.FormContainer = ModalFormContainer
DefaultNewNoteModal.Footer = ModalFooter
DefaultNewNoteModal.Button = ModalButton

export default DefaultNewNoteModal