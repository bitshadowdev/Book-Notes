import {describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import YourNotes from './YourNotes';
import { mockNote } from '../assets/testing.mocks';
import * as lib from '../lib'

describe('Your Notes Tests', () => {
  it('Your notes initial elements', () => {
    // Setup context driver spy
    const contextClicker = vi.fn()
    vi.spyOn(lib, 'makeContextDriver').mockReturnValue(contextClicker)

    const onEditNote = vi.fn();
    const onDelelteNote = vi.fn();
    const onOpenEditor = vi.fn();
    const notes = [mockNote];
    render(
      <YourNotes
        notes={notes}
        onDeleteNote={onDelelteNote}
        onEditNote={onEditNote}
        onOpenEditor={onOpenEditor}
        />
    )

    const mainMotion = screen.getByTestId('main-motion');
    expect(mainMotion).toBeVisible();
    const motionArticle = screen.getByTestId('note-0-article');
    
    setTimeout(() =>{
      fireEvent.contextMenu(mainMotion);
      expect(contextClicker).toBeCalled();
      expect(motionArticle).toBeVisible();
      fireEvent.click(motionArticle);
      expect(onOpenEditor).toBeCalled();
    }, 1000)

    // On context click

  })
})