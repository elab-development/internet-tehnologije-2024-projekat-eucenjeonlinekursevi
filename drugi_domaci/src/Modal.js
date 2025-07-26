import React from 'react';


const Modal = ({ message, onClose }) => {
  return (
    <div className="modal-backdrop">
      <div className="modal">
        <p>{message}</p>
        <button onClick={onClose}>Zatvori</button>
      </div>
    </div>
  );
};

export default Modal;