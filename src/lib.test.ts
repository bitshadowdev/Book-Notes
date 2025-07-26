import { describe, expect, it, vi } from 'vitest';
import * as db from './stores/database';
import * as lib from './lib'
import { mockNote } from './assets/testing.mocks';
import useGlobalStore from './stores/globalStore';

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
  it("Handle add new note submit", () => {
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
    const data = {
      bookTitle:'title', 
      bookDescription:'desc', 
      bookImage: image
    };
    const note: Note = {
      title: data.bookTitle,
      description: data.bookDescription,
      image: 'data:image/png;base64,MQ==',
      content: [],
      details: {
        author: '',
        publicationDate: '',
        genre: '',
        isbn: '',
        publisher: '',
        pageNumber: '',
      }
    };
    

    lib.handleAddNewNoteSubmit(data, ev).then(() => {
      expect(preventDefaultSpy).toBeCalled();
      expect(mockReader.readAsDataURL).toBeCalled();
      expect(spyCreateCollection).toBeCalledWith('notes');
      expect(spyAppendColletion).toBeCalled();
      expect(setStateSpy).toBeCalledTimes(5);
    })
  })

  it("Handle note edit correctly", () => {
    const updateInCollectionSpy = vi.fn()
    vi.spyOn(db, "updateItemInCollection").mockImplementation(updateInCollectionSpy)
    const expectedBase64 = "data:image/png;base64,MQ=="
    const data = {
      bookTitle: 'title',
      bookDescription: 'desc',
      bookImage: [ new File(['1'], 'test.png', { type: 'image/png' })]
    }

    const note: Note = {
      title: data.bookTitle,
      description: data.bookDescription,
      image: expectedBase64,
      content: [],
      details: {
        author: "",
        publicationDate: "",
        genre: "",
        isbn: "",
        publisher: "",
        pageNumber: "",
      }
    };

    const preventDefaultSpy = vi.fn();
    const ev = {
      preventDefault: preventDefaultSpy,
    }

    lib.handleNewNoteEdit(data, ev).then(() => {
      expect(updateInCollectionSpy).toBeCalled();
      expect(setStateSpy).toBeCalledTimes(1);
    })
  })

})