import {describe, it, expect, vi, beforeEach} from 'vitest';
import {render, screen} from '@testing-library/react';
import ContextMenu from './ContextMenu';

const mockUseGlobalStore = vi.fn();

vi.mock('../stores/globalStore', () => ({
  default: vi.fn((selector) => selector({
    contextMenuVisibility: mockUseGlobalStore()
  }))
}))

function renderSetup(mockRef = { current: null }, onClickMock = vi.fn()) {
  render(
    <ContextMenu ref={mockRef}>
      <ContextMenu.Button onClick={onClickMock} style="primary">Option 1</ContextMenu.Button>
      <ContextMenu.Button onClick={onClickMock} style="danger">Option 2</ContextMenu.Button>
    </ContextMenu>
  )
}

describe('ContextMenu Tests', () => {

  beforeEach( () => {
    vi.clearAllMocks();
  })
  
  it('Simple context menu initial state and visibility true', () => {
    mockUseGlobalStore.mockReturnValue(true);
    const mockRef = { current: null };

    renderSetup(mockRef);
    const contextMenu = screen.getByTestId('context-menu');
    expect(contextMenu).toBeInTheDocument();
    expect(contextMenu).toHaveClass('bg-gray-800 border-2 border-gray-700 rounded-md p-4 w-[20%] absolute top-0 left-0 cursor-pointer');
    // Test visibility
    expect(contextMenu).toHaveStyle('visibility: visible');

    // Check if the buttons are rendered
    const menuOptions = screen.getByTestId('context-menu-options');
    expect(menuOptions).toBeInTheDocument();
    expect(menuOptions.children.length).toBe(2);

    const option1 = menuOptions.children[0];
    const option2 = menuOptions.children[1];

    expect(option1).toHaveTextContent('Option 1');
    expect(option1).toHaveClass('p-2 hover:text-blue-500');

    expect(option2).toHaveTextContent('Option 2');
    expect(option2).toHaveClass('p-2 hover:text-red-500');
  });

  it('Context menu visibility false', () => {
    mockUseGlobalStore.mockReturnValue(false);
    const mockRef = { current: null };
    renderSetup(mockRef);


    const contextMenu = screen.getByTestId('context-menu');
    
    // Test visibility
    expect(contextMenu).toHaveStyle('visibility: hidden');
    expect(contextMenu).not.toBeVisible();
  });

  it ('Context menu button click', () => {
    mockUseGlobalStore.mockReturnValue(true);
    const mockRef = { current: null };
    const onClickMock = vi.fn();

    renderSetup(mockRef, onClickMock);

    const option1 = screen.getByText('Option 1');
    option1.click();
    expect(onClickMock).toHaveBeenCalledTimes(1);

    const option2 = screen.getByText('Option 2');
    option2.click();
    expect(onClickMock).toHaveBeenCalledTimes(2);
  })
});