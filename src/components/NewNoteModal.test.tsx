import {describe, expect, it, vi} from 'vitest';
import {fireEvent, render, screen} from '@testing-library/react';
import NewNoteModal, { ModalHeader } from './NewNoteModal'

const setterMock = vi.fn()
vi.mock('../stores/globalStore', () => (
  {
    'default': (state) => setterMock
  }
));


describe('Test Close Modal', () => {
  it('Is closed on closeButton press', () => {
    render(<ModalHeader>Hola</ModalHeader>);
    const headerModal = screen.getByTestId('header-modal');
    expect(headerModal).toBeVisible();

    const closeButton = screen.getByTestId('close-button');
    fireEvent.click(closeButton)
    expect(setterMock).toBeCalled;
  })

  it('New Note Modal Events', () => {
    const mockOnCancel = vi.fn();
    const mockOnSubmit = vi.fn();
    const mockOnEdit = vi.fn();
    render(<NewNoteModal 
      onSubmit={mockOnSubmit}
      onCancel={mockOnCancel}
      onEdit={mockOnEdit}
    />);
    
    const footer = screen.getByTestId('modal-footer');
    const cancel = footer.children[1];

    
    fireEvent.click(cancel)
    expect(mockOnCancel).toBeCalled();
  })
})