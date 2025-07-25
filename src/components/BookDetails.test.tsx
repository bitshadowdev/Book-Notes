import {describe, it, expect} from 'vitest';
import {render, screen} from '@testing-library/react';
import BookDetails from './BookDetails';
import { mockNote } from '../assets/testing.mocks';

describe('BookDetails Tests', () => {
  it ('Render book details', () => {


   // Render the component with the mock data
    render(<BookDetails currentNote={mockNote} />);

    // Check if the title is rendered correctly
    const titleElement = screen.getByTestId('book-details-title');
    const imageElement = screen.getByTestId('book-details-image');
    const descriptionElement = screen.getByTestId('book-details-description');


    expect(titleElement).toHaveTextContent(mockNote.title);
    expect(imageElement).toHaveAttribute('src', mockNote.image);
    expect(descriptionElement).toHaveTextContent(mockNote.description.slice(0, 30));
    expect(descriptionElement).toHaveAttribute('id', 'description');
    expect(screen.getByTestId('book-details')).toBeInTheDocument();
    expect(titleElement).toHaveClass('text-xl font-semibold mb-2 text-center');
    expect(imageElement).toHaveClass('h-[200px] w-[150px] border border-gray-700 p-2 mb-4 mx-auto');
    expect(descriptionElement).toHaveClass('w-full border-gray-700 rounded-md resize-none text-sm overflow-visible');
    
  })

  it ('Element is truncating at 30 words', () => {
    // Render the component with the mock data
    render(<BookDetails currentNote={mockNote} />);

    // Check if the description is truncated correctly
    const descriptionElement = screen.getByTestId('book-details-description');
    const truncatedText = mockNote.description.split(' ').slice(0, 30).join(' ');

    expect(descriptionElement).toHaveTextContent(truncatedText);
  })
});