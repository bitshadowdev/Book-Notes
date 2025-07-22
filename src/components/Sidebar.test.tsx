import React from "react";
import { cleanup, render, screen } from '@testing-library/react'
import { describe, it, expect, afterEach } from 'vitest'
import '@testing-library/jest-dom/vitest'
import Sidebar from "./Sidebar";


afterEach(() => {
  cleanup()
})

describe("Sidebar", () => {
  it("Renders ok", () => {
    render(<Sidebar><Sidebar.Button>Hello</Sidebar.Button> </Sidebar>)
    expect(screen.getByTestId('sidebar')).toBeInTheDocument()
    expect(screen.getByTestId('sidebar-button')).toHaveTextContent("Hello")
  })
})