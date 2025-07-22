import Header from "./components/Header";
import NewNoteModal from "./components/NewNoteModal";
import NoNotest from "./components/NoNotest";
import Sidebar from "./components/Sidebar";
import useGlobalStore from "./stores/globalStore";
import Editor from "./components/Editor";
import YourNotes from "./components/YourNotes";
import { handleAddNewNoteSubmit, handleDeleteNote, handleNewNoteEdit, handleOpenEditor, useInitApplication } from "./lib";

function App() {

  const {    
    isNewNoteModalOpen,
    openModal,
    isOnEditMode,
    areNotes, 
    notes
  } = useInitApplication()

  // Set context menu visibility to false if a left click on document is registerd 
  document.addEventListener('click', () => {
    useGlobalStore.setState({ contextMenuVisibility: false })
    const menu = document.getElementById('context-menu')
    if (menu) {menu.style.top = '0';menu.style.left = '0'};
  })

  const onEditNote = () => {
    useGlobalStore.setState({ createNoteModalOpen: true, newNoteModalEditMode: true })
  }


  return (
    <>
      <main id="mainframe" className=" h-full">
        <Header>Note Taker</Header>
        <div className="grid grid-cols-12 h-[90vh]">
          {/* Sidebar */}
          <Sidebar>
            <Sidebar.Button onClick={openModal}>+ Add Note</Sidebar.Button>
          </Sidebar>
          {/* End Sidebar */} 

          {/* Section empty */}

          {

            !isOnEditMode && !areNotes ? 
              <NoNotest mainLine="No hay notas todavia" seccondLine="Comienza a añadir notas para verlas aqui" />
            : !isOnEditMode && areNotes ? <YourNotes notes={notes} onOpenEditor={handleOpenEditor} onEditNote={onEditNote} onDeleteNote={handleDeleteNote} /> : <Editor />
          }
          { /* Section empty */}
          
          {/* Modal for<<< new note */}
          {
            isNewNoteModalOpen && <NewNoteModal onEdit={handleNewNoteEdit} onSubmit={handleAddNewNoteSubmit} onCancel={() => useGlobalStore.setState({ createNoteModalOpen: false, newNoteModalEditMode: false })} />
          }
          {/* Modal for new note */}
        </div>

      </main>
    </>
  )
}

export default App
