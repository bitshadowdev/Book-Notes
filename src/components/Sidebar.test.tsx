import {describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import Sidebar from './Sidebar';

describe("Sidebar Testing", () => {
  it('Sidebar functional and visible', () => {
    const onClickButtonSpy = vi.fn();
    render(<Sidebar.Button onClick={onClickButtonSpy}>Hola</Sidebar.Button>);
    
    const sidebarButton = screen.getByTestId('sidebar-button');
    fireEvent.click(sidebarButton);
    
    expect(onClickButtonSpy).toBeCalled();
  })

  it('Sidebar is showing', () => {
    render(<Sidebar><Sidebar.Button onClick={vi.fn()}>Hola</Sidebar.Button></Sidebar>)
  
    const sidebar = screen.getByTestId('sidebar')
    expect(sidebar).toBeVisible();
    // Render children
    const buttonSidebar = screen.getByTestId('sidebar-button');
    expect(buttonSidebar).toBeVisible()
  })
})