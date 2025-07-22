import React from 'react'

type ButtonProps = {
  children: React.ReactNode;
  onClick: () => void;
}



function Button({ children, onClick }: ButtonProps) {
  return (
    <button data-testId="sidebar-button" onClick={onClick} id="addNote" className="border-2 border-blue-600 bg-blue-600 p-2 w-full rounded-md hover:bg-blue-700 hover:text-white hover:border-blue-700">{ children } </button>
  )
}

function Sidebar({ children }: {children: React.ReactNode} ) {
  return (
    <aside data-testId="sidebar" className="col-span-2 border-r-1 border-r-gray-800 w-full  p-4">
      {children}
    </aside>
  )
}

Sidebar.Button = Button

export default Sidebar