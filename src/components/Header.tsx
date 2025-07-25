import React from 'react'

interface HeaderProps {
  children: React.ReactNode;
}

function Header({ children }: HeaderProps) {
  return (
    <header className='text-center'>
      <h1 className='text-3xl mt-4 border-b-1 border-b-gray-800 pb-4' data-testid="logo">{children}</h1>
    </header>
  )
}

export default Header