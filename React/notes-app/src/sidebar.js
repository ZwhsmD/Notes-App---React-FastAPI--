import './App.css'
import React from "react";
import { CgAddR } from "react-icons/cg";
import { useState } from 'react'

function Sidebar({notes, selected, add}) {

    const [inputValue, setInputValue] = useState()
    const [isOpen, setIsOpen] = useState(false)

    const handleSubmit = () => {
        if (inputValue.trim()) {
          add(inputValue); // call parent function with title
          setInputValue("");
          setIsOpen(false);
        }
      };

    return (
        <div className="sidebar">
           <ul className="list-group">
               {notes.map(note => (
                  <li key={note.id} onClick={() => selected(note)} className="list-group-item note">
                    {note.title}
                  </li>
                ))}
          </ul>
          <CgAddR className="addSign" onClick={() => setIsOpen(true)}></CgAddR>

          {/*Popup*/}
          {isOpen && (
            <div className="popup">
              <div className="popup-content">
                <h4>New Note</h4>
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Enter title"
                />
                <div style={{ marginTop: "10px" }}>
                  <button onClick={handleSubmit}>Create</button>
                  <button onClick={() => setIsOpen(false)}>Cancel</button>
                </div>
              </div>
            </div>
          )}
        </div>
    );
}

export default Sidebar;
