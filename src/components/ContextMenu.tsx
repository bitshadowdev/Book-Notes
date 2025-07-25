import type { PropsWithChildren } from "react";
import useGlobalStore from "../stores/globalStore";

type CtxMenuButtonProps = {
  onClick?: () => void;
  style: 'primary' | 'danger';
}

type ContextMenu = {
  ref: React.RefObject<HTMLElement | null>;
  
}

export function ContextMenuButton({ children, onClick, style }: PropsWithChildren<CtxMenuButtonProps>) {
  
  const s = style === 'primary' ? 'p-2 hover:text-blue-500' : 'p-2 hover:text-red-500' 
  
  return (
    <li
      onClick={onClick}
      className={s}
      id="context-menu"
    >
      {children}
    </li>
  )
}

function ContextMenu({ref, children}: PropsWithChildren<ContextMenu>) {
  const contextMenuVisibility = useGlobalStore((state) => state.contextMenuVisibility)


  return (
          <section id="context-menu" 
            className='bg-gray-800 border-2 border-gray-700 rounded-md p-4 w-[20%] absolute top-0 left-0 cursor-pointer'
            ref={ref}
            style={{visibility: contextMenuVisibility ? 'visible' : 'hidden'}}
          >
            <ul id="menu-options">
              { children }
            </ul>
          </section>
  )
}

export default ContextMenu;
