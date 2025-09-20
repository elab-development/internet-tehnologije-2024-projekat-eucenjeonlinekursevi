import React from 'react';

const Modal = ({ children, onClose }) => {
  return (
    <div className="modal-backdrop" style={{
      position: 'fixed',
      top:0, left:0, right:0, bottom:0,
      backgroundColor:'rgba(0,0,0,0.5)',
      display:'flex', alignItems:'center', justifyContent:'center'
    }}>
      <div className="modal" style={{
        backgroundColor:'white', padding:'20px', borderRadius:'8px', minWidth:'300px'
      }}>
        {children}  
        <button onClick={onClose} style={{marginTop:'10px'}}>Zatvori</button>
      </div>
    </div>
  );
};

export default Modal;
