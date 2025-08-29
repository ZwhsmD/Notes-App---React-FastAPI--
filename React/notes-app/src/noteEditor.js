import './App.css'
import React, { useState, useEffect } from 'react';
import api from './api.js'

function Editor({selectedNote, setNotes, setSelectedNote}) {
    const [content, setContent] = useState('')

    useEffect(() => {
          if (selectedNote) {
             setContent(selectedNote.content)
          }
    },[selectedNote]);

    const handleSave = async () => {
        if(!selectedNote) return;
        const updatedNote = {
            ...selectedNote,
            title: selectedNote.title ?? "Untitled",
            content,
        };
        const response = await api.put(`/notes/${selectedNote.id}/`, updatedNote);
        alert("Note saved!")
        setSelectedNote(response.data)
        setNotes(prevNotes =>
          prevNotes.map(note =>
            note.id === selectedNote.id ? response.data : note
          )
        );
    };

    const handleDelete = async () => {
        if(!selectedNote) return;
        await api.delete(`/notes/${selectedNote.id}/`)
        alert("Note deleted!")
        setSelectedNote(null)

        setNotes(prevNotes => {
            const remaining = prevNotes.filter(note => note.id !== selectedNote.id);
            setSelectedNote(remaining.length > 0 ? remaining[0] : null);
            return remaining;
        });
    };

    return (
        <div>
          <h3>{selectedNote.title}</h3>
          <textarea
            value={content}
            placeholder="Type your note here..."
            onChange={(e) => setContent(e.target.value)}
            rows={10}
            cols={50}
            className="editor"
          />
          <div>
              <button className="delete" onClick={handleDelete}>Delete</button>
              <button className="saveButton" onClick={handleSave}>Save</button>
          </div>
        </div>
    );
}

export default Editor;
