import { useState, useEffect} from 'react'
import './App.css'
import api from './api.js'
import Navbar from './navbar.js';
import Sidebar from './sidebar.js';
import Editor from './noteEditor.js';

function App() {

  const [notes, setNotes] = useState([]);
  const [selectedNote, setSelectedNote] = useState([])


  const fetchNotes = async () => {
    const response = await api.get('/');
    console.log(response.data);
    setNotes(response.data)

    if (response.data.length > 0) {
        setSelectedNote(response.data[0]);
    }
  };

  useEffect(() => {
    fetchNotes()
  }, []);

  const handleAddNote = async (title) => {

    const newNote = { title, content: "" };
    const response = await api.post("/notes/", newNote);

    setNotes([...notes, response.data]); // update sidebar
    setSelectedNote(response.data); // open the new note in editor
  };


  return (
    <>
      <div>
         <Navbar />
            <div className="d-flex">
                <div className="App">
                    <Sidebar notes={notes} selected={setSelectedNote} add={handleAddNote} />
                </div>
                <div className="main">
                    <Editor
                        selectedNote={selectedNote}
                        setNotes={setNotes}
                        setSelectedNote={setSelectedNote}
                      />
                </div>
            </div>
      </div>
    </>
  )
}

export default App;
