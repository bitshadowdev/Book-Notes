import React from "react";
import { cleanup, render, screen } from '@testing-library/react'
import Header from "./Header";
import { describe, it, expect, afterEach } from 'vitest'
import '@testing-library/jest-dom/vitest'

afterEach(() => {
  cleanup()
})

describe("Heading", () => {
  it("Render no logo text", () => {
    render(<Header children={undefined} />)
    expect(screen.getByTestId('logo')).toHaveTextContent('no logo')
  })

  it("Render children as text", () => {
    render(<Header>Test</Header>)
    expect(screen.getByTestId('logo')).toHaveTextContent('Test')
  })


  
})