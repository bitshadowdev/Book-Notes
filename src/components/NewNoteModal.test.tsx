import React from "react";
import { cleanup, render, screen } from '@testing-library/react'
import { describe, it, expect, afterEach } from 'vitest'
import '@testing-library/jest-dom/vitest'
import NewNoteModal from "./NewNoteModal";

afterEach(() => {
  cleanup()
})

describe("NewNoteModal", () => {
  it("ModalHeader renders children and close button", () => {
    render(<NewNoteModal.Header>Test Header</NewNoteModal.Header>)
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('Test Header')
    expect(screen.getByRole('button')).toHaveTextContent('[ X ]')
  })

  it("ModalFormContainer renders children", () => {
    render(<NewNoteModal.FormContainer><p>Test Form</p></NewNoteModal.FormContainer>)
    expect(screen.getByText('Test Form')).toBeInTheDocument()
  })

  it("ModalFooter renders children", () => {
    render(<NewNoteModal.Footer><button>Test Button</button></NewNoteModal.Footer>)
    expect(screen.getByRole('button')).toHaveTextContent('Test Button')
  })

  it("ModalButton renders children and applies primary variant styles", () => {
    render(<NewNoteModal.Button variant="primary">Primary Button</NewNoteModal.Button>)
    const button = screen.getByRole('button');
    expect(button).toHaveTextContent('Primary Button')
    expect(button).toHaveClass('bg-blue-600')
  })

  it("ModalButton renders children and applies secondary variant styles", () => {
    render(<NewNoteModal.Button variant="secondary">Secondary Button</NewNoteModal.Button>)
    const button = screen.getByRole('button');
    expect(button).toHaveTextContent('Secondary Button')
    expect(button).toHaveClass('bg-gray-600')
  })
})