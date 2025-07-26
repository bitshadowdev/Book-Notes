import {describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import NoNotesDefault from './NoNotest';

describe("Is no notes showing correctly", () => {
  it('Is main and seccond line rendering', () => {
    render(
      <NoNotesDefault 
        mainLine='Nothing to see...'
        seccondLine='There is nothing...'
      />
    )
 
    const noNotesContainer = screen.getByTestId('no-notes-container');
    expect(noNotesContainer).toBeVisible();
    
    const noNotesDefaultIcon = screen.getByTestId('no-notes-default-icon');
    expect(noNotesDefaultIcon).toBeVisible();

    const mainLine = screen.getByTestId('main-line');
    const seccondLine = screen.getByTestId('seccond-line');
    
    expect(mainLine).toBeVisible();
    expect(seccondLine).toBeVisible();
  })

  it('Not display default icon', () => {
    render(
      <NoNotesDefault 
        mainLine='No hay archivos'
        seccondLine='No hay nada'
        icon={<p data-testid="icon">Icon</p>}
      />
    );
    
    const icon = screen.getByTestId('icon');
    expect(icon).toBeVisible();
  })
});