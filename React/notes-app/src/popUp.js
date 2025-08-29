import React, { useState } from "react";

function AddNotePopup({ isOpen, onClose, onAdd }) {
  const [title, setTitle] = useState("");

  const handleSubmit = () => {
    if (!title.trim()) return; // prevent empty titles
    onAdd(title);
    setTitle(""); // reset input
    onClose(); // close popup
  };

  if (!isOpen) return null; // don't render when closed

  return (
    <div className="overlay">
      <div className="popup">
        <h2>New Note</h2>
        <input
          type="text"
          placeholder="Enter note title..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <div className="buttons">
          <button onClick={handleSubmit}>Create</button>
          <button onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
}

export default AddNotePopup;
