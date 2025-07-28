import { describe, expect, it, vi } from 'vitest';
import * as db from './stores/database';
import * as lib from './lib'
import { mockNote } from './assets/testing.mocks';
import type { ModalNewNoteInputs } from './types';

const { getStateSpy } = vi.hoisted(() => {
  return { getStateSpy: vi.fn() }
});


const { setStateSpy } = vi.hoisted(() => {
  return { setStateSpy: vi.fn() }
});


vi.mock('./stores/globalStore', () => {
  return {
    'default': {
    setState: setStateSpy,
    getState: () => {
      getStateSpy();
      return {
        editingdNoteId: 0,
        notes: [mockNote]
      }
    }
    }

  }
})

describe("Testing lib", () => {
  const preventDefaultSpy = vi.fn();
  const ev = {
    preventDefault: preventDefaultSpy,
  }
  it("Handle add new note submit", async () => {
    const expectedBase64 = "data:image/png;base64,MQ=="
    const spyCreateCollection = vi.fn()
    const spyAppendColletion = vi.fn()
    vi.spyOn(db, 'createCollection').mockImplementation(spyCreateCollection)
    vi.spyOn(db, 'appendItemToCollection').mockImplementation(spyAppendColletion)

    const mockReader = {
      readAsDataURL: vi.fn(),
      onLoad: () => {},
      onError: () => {},
      result: expectedBase64
    }
    
    
    const image =  new File(['1'], 'test.png', {type: 'image/png'});
    vi.spyOn(window, 'FileReader').mockImplementation(() => mockReader as any)
    db.createCollection("notes")
    const data: ModalNewNoteInputs = {
      bookTitle:'title', 
      bookDescription:'desc', 
      bookImage: [image] // Envolver en array
    };
    

    await lib.handleNewNoteEdit(data, ev as any);  // Añadir await
    expect(preventDefaultSpy).toBeCalled();
    expect(mockReader.readAsDataURL).toBeCalled();
    expect(spyCreateCollection).toBeCalledWith('notes');
    expect(spyAppendColletion).toBeCalled();
  })
  it("Handle note edit correctly", async () => {  // Añadir async
    const updateInCollectionSpy = vi.fn()
    vi.spyOn(db, "updateItemInCollection").mockImplementation(updateInCollectionSpy)
    
    const data: ModalNewNoteInputs = {
      bookTitle: 'title',
      bookDescription: 'desc',
      bookImage: [new File(['1'], 'test.png', { type: 'image/png' })] // Asegurarse que sea array
    }

    const preventDefaultSpy = vi.fn();
    const ev = {
      preventDefault: preventDefaultSpy,
    } as any

    // Usar await en lugar de .then()
    await lib.handleNewNoteEdit(data, ev);  // Añadir await
    
    expect(updateInCollectionSpy).toBeCalled();
    expect(setStateSpy).toBeCalledTimes(1);
  })
})