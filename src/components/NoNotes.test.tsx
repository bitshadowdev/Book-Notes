import React from "react";
import { cleanup, render, screen } from '@testing-library/react'
import { describe, it, expect, afterEach } from 'vitest'
import '@testing-library/jest-dom/vitest'
import NoNotest from "./NoNotest";

afterEach(() => {
  cleanup()
})

describe("NoNotes", () => {
  it("No notes render main and seccond line", () => {
    render(<NoNotest mainLine="Main line" seccondLine="Seccond line" />)
    expect(screen.getByTestId('mainLine')).toHaveTextContent('Main line')
    expect(screen.getByTestId('seccondLine')).toHaveTextContent('Seccond line')
  })



  
})