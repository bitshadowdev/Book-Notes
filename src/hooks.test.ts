import { describe, expect, it } from 'vitest';
import { renderHook } from '@testing-library/react';
import * as hooks from './hooks';
import * as db from './stores/database';
import { mockNote } from './assets/testing.mocks';
import { act } from 'react';

describe('Testing if hooks are loaded in the correct manner', () => {
  it("Use init application return the correct init values", () => {
    const {result} = renderHook(() => hooks.useInitApplication())
    expect(result.current.isNewNoteModalOpen).toBe(false);
    expect(result.current.openModal).toBe(hooks.openModal)
    expect(result.current.isOnEditMode).toBe(false)
    expect(result.current.areNotes).toBe(false)
    expect(result.current.notes).toStrictEqual({})
    expect(result.current.currentNote).toStrictEqual(undefined)
    expect(result.current.onEditNote).toBe(hooks.onEditNote)
  })

  it ("Use init applications with notes loaded", () => {
    db.createCollection('notes');
    db.appendItemToCollection('notes', mockNote);
  
    const {result} = renderHook(() => hooks.useInitApplication())

    expect(result.current.isNewNoteModalOpen).toBe(false);
    expect(result.current.openModal).toBe(hooks.openModal)
    expect(result.current.isOnEditMode).toBe(false)
    expect(result.current.areNotes).toBe(true)
    expect(result.current.notes).toStrictEqual([{}, mockNote])
    expect(result.current.currentNote).toStrictEqual({})
    expect(result.current.onEditNote).toBe(hooks.onEditNote)
  })

  it ("Use Mardown Renderer init values", () => {
    const {result} = renderHook(() => hooks.useMarkdownRenderer(0, 'Hola'));
    expect(result.current.grouphHovered).toStrictEqual({'visibility': 'hidden'});
    expect(result.current.setGrouphHovered).toBeTypeOf('function');
    expect(result.current.isOnEditing).toBe(false);
    expect(result.current.setCode).toBeTypeOf('function');
    expect(result.current.code).toBe('');
    expect(result.current.handleEnterEdition).toBeTypeOf('function');
    expect(result.current.setEditingMode).toBeTypeOf('function')
  })

  it ("Act to set code to Hola", () => {
    const {result} = renderHook(() => hooks.useMarkdownRenderer(0, 'Hola'));
    
    act(() => {
      result.current.setEditingMode();
    })
    
    expect(result.current.grouphHovered).toStrictEqual({'visibility': 'hidden'});
    expect(result.current.setGrouphHovered).toBeTypeOf('function');
    expect(result.current.isOnEditing).toBe(true);
    expect(result.current.setCode).toBeTypeOf('function');
    expect(result.current.code).toBe('Hola');
    expect(result.current.handleEnterEdition).toBeTypeOf('function');
    expect(result.current.setEditingMode).toBeTypeOf('function');
  })

  it ("Act to fire enter edition", () => {
    const {result} = renderHook(() => hooks.useMarkdownRenderer(0, 'Hola'));
    
    act(() => {
      result.current.setEditingMode();

      result.current.handleEnterEdition({altKey: true, key: "Enter"});
    })
    
    expect(result.current.grouphHovered).toStrictEqual({'visibility': 'hidden'});
    expect(result.current.setGrouphHovered).toBeTypeOf('function');
    expect(result.current.isOnEditing).toBe(false);
    expect(result.current.setCode).toBeTypeOf('function');
    expect(result.current.code).toBe('Hola');
    expect(result.current.handleEnterEdition).toBeTypeOf('function');
    expect(result.current.setEditingMode).toBeTypeOf('function');
  })

  it("Use editor initial state", () => {
    const {result} = renderHook(() => hooks.useEditor())
    
    // No note setted
    expect(result.current.currentNote).toBe(null);
    expect(result.current.content).toBe(undefined);
    expect(result.current.setCode).toBeTypeOf('function');
    expect(result.current.handleAltEnter).toBeTypeOf('function');
    expect(result.current.handleDeleteBlock).toBeTypeOf('function');
    expect(result.current.contextMenuRef).toStrictEqual({ "current": null })
    expect(result.current.onContextClick).toBeTypeOf('function')
    expect(result.current.mouseElementId).toBe(-1)
    expect(result.current.setMouseElementId).toBeTypeOf('function')
    expect(result.current.contextClickOverride).toBeTypeOf('function')
    expect(result.current.handleCopyToClipboard).toBeTypeOf('function')
    expect(result.current.editMetadata).toBeTypeOf('function')
  })

})

