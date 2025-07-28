import {describe, it, expect, vi, beforeEach} from 'vitest';
import {fireEvent, render, screen} from '@testing-library/react';
import Editor, { MarkdownRendered, MarkdownBlock, EditableTD } from './Editor';
import * as hooks from '../hooks';
import * as lib from '../lib';
import { mockNote } from '../assets/testing.mocks';

const configureSpyOn = (returnValueDiff: any) => {
  vi.spyOn(hooks, 'useMarkdownRenderer').mockReturnValue({
    grouphHovered: { visibility: 'hidden' },
    setGrouphHovered: vi.fn(),
    isOnEditing: false,
    code: '',
    setCode: vi.fn(),
    handleEnterEdition: vi.fn(),
    extensions: [],
    setEditingMode: vi.fn(),
    ...returnValueDiff
  });
}

describe('MarkdownRendered Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  })

  it ('Initial render of MarkdownRendered', () => {
    const mockOnDelete = vi.fn();
    const mockOnContextClick = vi.fn();
    const mockSetMouseElementId = vi.fn();
    const markdownContent = '# Heading\n\nSome **bold** text';
    render(
      <MarkdownRendered
        id={1} 
        onDelete={mockOnDelete} 
        onContextClick={mockOnContextClick} 
        setMouseElementId={mockSetMouseElementId}
      >
        {markdownContent}
      </MarkdownRendered>
    );

    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toBeInTheDocument();

    const boldText = screen.getByText('bold');
    expect(boldText).toBeInTheDocument();
    expect(boldText.tagName).toBe('STRONG');

  });

  it('Rendering editing mode correctly', () => {
    configureSpyOn({
      isOnEditing: true,
      code: 'Test content',
    });

    const mockOnDelete = vi.fn();
    const mockOnContextClick = vi.fn(); 
    const mockSetMouseElementId = vi.fn();

    render(
      <MarkdownRendered
        id={1} 
        onDelete={mockOnDelete} 
        onContextClick={mockOnContextClick} 
        setMouseElementId={mockSetMouseElementId}>
          Test Content
      </MarkdownRendered>
    )

    const editingInsturction = screen.getByTestId('editing-instruction');
    expect(editingInsturction).toBeInTheDocument();
  });

  it('Double-Click set to editing mode', () => {
    const setEditingModeSpy = vi.fn();
    configureSpyOn({
      setEditingMode: setEditingModeSpy,
    });

    // Comprobar que al hacer doble clic se llama a setEditingMode
    const mockOnDelete = vi.fn();
    const mockOnContextClick = vi.fn();
    const mockSetMouseElementId = vi.fn();

    render(
      <MarkdownRendered
        id={1} 
        onDelete={mockOnDelete} 
        onContextClick={mockOnContextClick} 
        setMouseElementId={mockSetMouseElementId}>
          Test Content
      </MarkdownRendered>
    );

    const markdownElement = screen.getByText('Test Content');
    fireEvent.doubleClick(markdownElement);

    expect(setEditingModeSpy).toHaveBeenCalled();
  });

  it('Test edit and delete functionality', () => {
    const setEditingModeSpy = vi.fn();
    configureSpyOn({
      setEditingMode: setEditingModeSpy,
    })

    const mockOnDelete = vi.fn();
    const mockOnContextClick = vi.fn();
    const mockSetMouseElementId = vi.fn();

    render(
      <MarkdownRendered
        id={1} 
        onDelete={mockOnDelete} 
        onContextClick={mockOnContextClick} 
        setMouseElementId={mockSetMouseElementId}>
          Test Content
      </MarkdownRendered>
    );  

    const deleteButton = screen.getByTestId('delete-button');
    const editButton = screen.getByTestId('edit-button');

    fireEvent.click(deleteButton);
    expect(mockOnDelete).toHaveBeenCalled();

    fireEvent.click(editButton);
    expect(setEditingModeSpy).toHaveBeenCalled();
  })

  it('Test mouse down and mouse up set mouseElementId and context menu', () => {
    const mockSetMouseElementId = vi.fn();
    configureSpyOn({
      setMouseElementId: mockSetMouseElementId,
    });
    const mockOnDelete = vi.fn();
    const mockOnContextClick = vi.fn();
    render(
      <MarkdownRendered
        id={1} 
        onDelete={mockOnDelete} 
        onContextClick={mockOnContextClick} 
        setMouseElementId={mockSetMouseElementId}>
          Test Content
      </MarkdownRendered>
    );

    const editorBlockContainer = screen.getByTestId('editorBlock-container');
    fireEvent.mouseDown(editorBlockContainer);
    expect(mockSetMouseElementId).toHaveBeenCalledWith(1);
    fireEvent.mouseOut(editorBlockContainer);
    expect(mockSetMouseElementId).toHaveBeenCalledWith(-1);

    fireEvent.contextMenu(editorBlockContainer);
    expect(mockOnContextClick).toHaveBeenCalled();
  });
})

describe('MarkdownBlock Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  })

  it('Initial render of MarkdownBlock', () => {
    const setCodeMock = vi.fn();
    const markdownContent = '# Heading\n\nSome **bold** text';
    
    render(<MarkdownBlock code={markdownContent} setCode={setCodeMock} />);

    const markdownInstructions = screen.getByTestId('markdown-instructions');
    expect(markdownInstructions).toBeInTheDocument();
    expect(markdownInstructions.textContent).toContain('Presione Alt+Enter para insertar el bloque.');
  });
})

describe('EditableTD Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  })

  it('Initial render of EditableTD and fire editable', () => {
    const mockSetter = vi.fn();
    const isEditableSpy = vi.fn();
    vi.spyOn(hooks, 'useEditableTD').mockReturnValue({
      isEditable: false,
      setIsEditable: isEditableSpy,
      inputValue: '',
      setInputValue: vi.fn(),
      inputRef: {current: null}
    })

    render(<EditableTD setter={mockSetter}>Editable Content</EditableTD>);
    const editableToggler = screen.getByTestId('editable-toggler');
    expect(editableToggler.textContent).toBe('Editable Content');
    fireEvent.click(editableToggler)
    expect(isEditableSpy).toBeCalled();

  });

  it ('Editable set state', () => {
    const mockSetter = vi.fn();
    const setInputValueSpy = vi.fn();

    vi.spyOn(hooks, 'useEditableTD').mockReturnValue({
      isEditable: true,
      setIsEditable: vi.fn(),
      inputValue: '',
      setInputValue: setInputValueSpy,
      inputRef: {current: null}
    })

    render(<EditableTD setter={mockSetter}>Editable Content</EditableTD>);
    
    const tdInput = screen.getByTestId('td-input');
    expect(tdInput).toBeVisible();
  })

  it ('Set is editable on esc and on enter', () => {
    const mockSetter = vi.fn();
    const setIsEditableSpy = vi.fn();
    vi.spyOn(hooks, 'useEditableTD').mockReturnValue({
      isEditable: true,
      setIsEditable: setIsEditableSpy,
      inputValue: '',
      setInputValue: vi.fn(),
      inputRef: {current: null}
    });

    render(
      <EditableTD setter={mockSetter}>Editable Content</EditableTD>
    );

    const tdInput = screen.getByTestId('td-input');

    fireEvent.keyUp(tdInput, { key: 'Escape', code: 'Escape' });
    expect(setIsEditableSpy).toHaveBeenCalledWith(false);
    fireEvent.keyUp(tdInput, { key: 'Enter', code: 'Enter' });
    expect(setIsEditableSpy).toHaveBeenCalledWith(false);
  })
})


const configureSpyOnEditor = (returnValueDiff: any = {}) => {
  vi.spyOn(hooks, 'useEditor').mockReturnValue({
    currentNote: mockNote,
    content: mockNote.content, 
    code: '', 
    setCode: vi.fn(),
    handleAltEnter: vi.fn(),
    handleDeleteBlock: vi.fn(),
    contextMenuRef: {current: null},
    onContextClick: vi.fn(),
    mouseElementId: 0,
    setMouseElementId: vi.fn(), 
    contextClickOverride: vi.fn(), 
    handleCopyToClipboard: vi.fn(),
    ...returnValueDiff
  })
}

describe('Editor Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  })
  
  it ('Initial Editor Header State', () => {
    configureSpyOnEditor({});
    render(<Editor />);

    const editorHeader = screen.getByTestId('editor-header');
    expect(editorHeader).toBeVisible();
    expect(editorHeader).toHaveTextContent('Test Book Title');

    const editorSmall = screen.getByTestId('editor-small');
    expect(editorSmall).toBeVisible();

    const editorBack = screen.getByTestId('back-button');
    expect(editorBack).toBeVisible();
  })

  it ('Editor header events', () => {
    const handleAltEnterSpy = vi.fn();
    const handleCloseEditorSpy = vi.fn();
    const editMetadata = vi.fn();
    vi.spyOn(lib, 'handleCloseEditor').mockImplementation(
      handleCloseEditorSpy
    )
    configureSpyOnEditor({ handleAltEnter: handleAltEnterSpy, editMetadata });
    render(<Editor />);

    const generalContainer = screen.getByTestId('general-container');
    fireEvent.keyDown(generalContainer,{ key: 'Escape', code: 'Escape', altKey: true });
    expect(handleAltEnterSpy).toBeCalled();

    const backButton = screen.getByTestId('back-button');
    expect(backButton).toBeVisible();
    fireEvent.click(backButton);
    expect(handleCloseEditorSpy).toBeCalled();

    const AeditMetadata = screen.getByTestId('edit-metadata');
    expect(AeditMetadata).toBeVisible();

    fireEvent.click(AeditMetadata)
    expect(editMetadata).toBeCalled();
  })

})