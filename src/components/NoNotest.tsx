import React from 'react'

type Props = {
  mainLine: string;
  seccondLine: string;
}

type NotesContainerProps = {
  children: React.ReactNode;
  icon?: React.ReactNode;
}

function DefaultIcon() {
  return (
    <svg className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
      <path vector-effect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h4l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
    </svg>
  )
}


function NoNotesHeader({ children }: { children: React.ReactNode }) {
  return (
    <p className="mt-2 text-sm font-medium text-gray-500 dark:text-gray-400" data-testId='mainLine'>{children}</p>
  )
}

function NoNotesSubHeader({ children }: { children: React.ReactNode }) {
  return (
    <p className="mt-1 text-xs text-gray-400 dark:text-gray-500" data-testId='seccondLine'>{children}</p>
  )
}

function NoNotesContainer({ children, icon }: NotesContainerProps) {
  return (
    <div className="col-span-10 w-full h-full flex items-center justify-center p-8 bg-gray-50 dark:bg-gray-950 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
      <div className="text-center">
        {icon ? '' : <DefaultIcon />}
        { children }
      </div>
    </div>
  )
}

function NoNotesDefault({ mainLine, seccondLine }: Props) {
  return (
    <NoNotesContainer>
      <NoNotesHeader>{mainLine}</NoNotesHeader>
      <NoNotesSubHeader>{seccondLine}</NoNotesSubHeader>
    </NoNotesContainer>
  )
}

NoNotesDefault.Header = NoNotesHeader
NoNotesDefault.SubHeader = NoNotesSubHeader
NoNotesDefault.Container = NoNotesContainer

export default NoNotesDefault