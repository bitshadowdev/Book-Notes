import {beforeEach, describe, expect, it, vi } from 'vitest';
import * as db from './database'
import { mockNote } from '../assets/testing.mocks';
import type { Note } from '../types';

const configureLocalStorage = () => {
    db.createCollection('notes');
    db.appendItemToCollection<Note>('notes', mockNote);
}

describe("Testing localstorage functions", () => {
  beforeEach(() => {
    localStorage.clear();
  })

  it("exists collection", () => {
    const nExist = db.existCollection('notas');
    expect(nExist).toBe(false);

    localStorage.setItem("notas", "1");
    const exist = db.existCollection('notas');
    expect(exist).toBe(true);
  })

  it("Create a and get an empty collection", () => {
    db.createCollection('notes');
    const collection = JSON.stringify(db.getCollection('notes'));
    expect(collection).toBe("[{}]");
  })

  it("Create an empty collection and appending a item into it", () => {
    configureLocalStorage();
    const collection = JSON.stringify(db.getCollection('notes'));
    const expected = JSON.stringify([{}, mockNote]);
    expect(collection).toBe(expected);
  })

  it("Getting an item from the collection", () => {
    configureLocalStorage();
    const item = db.getItemFromCollection('notes', 1);
    expect(item).toStrictEqual(mockNote);
  })

  it("Updating an item from the collection", () => {
    configureLocalStorage();
    const updatedItem = mockNote;
    mockNote['title'] = 'modified';
    db.updateItemInCollection('notes', 1, updatedItem);
    const updatedItemFormCollection = db.getItemFromCollection('notes', 1)
    expect(updatedItemFormCollection).toStrictEqual(updatedItem);
  })

  it("Deleting an item from the collection", () => {
    configureLocalStorage();
    let collection = db.getCollection<Note[]>('notes')
  
    expect([...collection].length).toBe(2)
    db.deleteItemInCollection("notes", 1);
    collection = db.getCollection('notes')
    expect([...collection].length).toBe(1)
  })

  it("Convert image to Base64",  () => {
    const mockFile = new File(['1'], 'test.png', {type: 'Image/png'});

    const expectedBase64 = "data:image/png;base64,MQ=="

    const mockReader = {
      readAsDataURL: vi.fn(),
      onLoad: () => {},
      onError: () => {},
      result: expectedBase64
    }

    const fileReaderSpy = vi.spyOn(window, 'FileReader').mockImplementation(() => mockReader as any)

    db.imageToBase64(mockFile).then(() => {
        expect(fileReaderSpy).toHaveBeenCalled();
        expect(mockReader.readAsDataURL).toHaveBeenCalledWith(mockFile);
      });
  })

  it ("Deberia rechazar la promesa si se recibe un error al leer el archivo", () => {
    const mockFile = new File(['1'], 'test.png', {type: 'Image/png'});
    const mockError = new Error("Error de lectura.")

    const mockReader = {
      readAsDataURL: vi.fn(),
      onload: () => {},
      onerror: () => {},
      result: null
    }
    
    vi.spyOn(window, 'FileReader').mockImplementation(() => mockReader as any);
    const promise = db.imageToBase64(mockFile);

    promise.catch(error => {
      expect(error).toBe(mockError);
    });
  });
});
