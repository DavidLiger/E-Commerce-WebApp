import React, { useState } from 'react';
import Modal from 'react-modal';

import CloseCross from '../assets/images/close_cross.png'

Modal.setAppElement('#root');

const AdviceModal = (props) => {
  const [modalIsOpen, setIsOpen] = useState(false);

  const openModal = () => {
    setIsOpen(true);
  }

  const closeModal = () => {
    setIsOpen(false);
  }

  return (
    <div>
      <button 
        // className='modalButton'
        id='repairButton' 
        style={{position:'relative',fontSize:'1.2em', borderRadius:'6px', borderStyle:'none', backgroundColor:'rgba(255, 255, 255, 0.5)',width:'150px',height:'100px', cursor:'pointer'}} 
        onClick={openModal}
      >
        {props.title}
      </button>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={customStyles}
      >
        <div style={{display: 'flex', justifyContent: 'flex-end'}}>
          <div style={{marginRight:'5vw', fontSize: '1.8em', fontWeight:'bold', fontFamily:'Dancing Script'}}>{props.header}</div>
          <img style={{width:30, marginBottom:'25px', cursor:'pointer', float:'right'}}
                        src={CloseCross}
                        alt="909"
                        onClick={closeModal}
                    />
        </div>
        <div style={{fontSize: '1.1em', display: 'flex', justifyContent: 'space-around', marginTop:'2vh'}}>{props.advice}</div>
      </Modal>
    </div>
  )
}

const customStyles = {
  content: {
    display: 'flex',
    flexDirection: 'column',
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    width:'60vw'
  },
  overlay: {
    position: 'fixed',
    zIndex: 50,
    background: 'rgba(255, 255, 255, 0.5)'
  },
};

export default AdviceModal