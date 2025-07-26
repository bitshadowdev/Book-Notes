import React from 'react'
import type { NoNotesContainerProps, NoNotesProps } from '../types'

function DefaultIcon() {
  return (
    <svg data-testid="no-notes-default-icon" className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
      <path vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h4l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
    </svg>
  )
}


function NoNotesHeader({ children }: { children: React.ReactNode }) {
  return (
    <p className="mt-2 text-sm font-medium text-gray-500 dark:text-gray-400" data-testid='main-line'>{children}</p>
  )
}

function NoNotesSubHeader({ children }: { children: React.ReactNode }) {
  return (
    <p className="mt-1 text-xs text-gray-400 dark:text-gray-500" data-testid='seccond-line'>{children}</p>
  )
}

function NoNotesContainer({ children, icon }: NoNotesContainerProps) {
  return (
    <div data-testid="no-notes-container" className="text-center col-span-10 w-full h-full flex items-center justify-center p-8 bg-gray-50 dark:bg-gray-950 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        {icon ? icon : <DefaultIcon />}
        { children }
    </div>
  )
}

function NoNotesDefault({ mainLine, seccondLine, icon }: NoNotesProps) {
  return (
    <NoNotesContainer icon={icon}>
      <NoNotesHeader>{mainLine}</NoNotesHeader>
      <NoNotesSubHeader>{seccondLine}</NoNotesSubHeader>
    </NoNotesContainer>
  )
}

NoNotesDefault.Header = NoNotesHeader
NoNotesDefault.SubHeader = NoNotesSubHeader
NoNotesDefault.Container = NoNotesContainer

export default NoNotesDefault