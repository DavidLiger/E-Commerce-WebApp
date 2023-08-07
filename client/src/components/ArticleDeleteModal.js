import React, { useState } from 'react';
import Modal from 'react-modal';

Modal.setAppElement('#root');

const ArticleDeleteModal = (props) => {
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
                className="article-details-delete" 
                onClick = {openModal}
            /> 
        <Modal
            isOpen={modalIsOpen}
            onRequestClose={closeModal}
            style={customStyles}
            >
                <div style={{display: 'flex', flexDirection: 'column',width: '100%', height:'100%'}}>
                    <span style={{height: '50%',display: 'flex', justifyContent: 'center', alignItems: 'center'}}>Voulez-vous supprimer l'article {props.title} ?</span>
                    <div style={{height: '50%', display: 'flex', flexDirection: 'row', justifyContent: 'space-around'}}>
                        <button
                            className='articleDeleteButton'
                            onClick={props.handleDeleteClick}
                        >Supprimer</button>
                        <button
                            className='articleDeleteButton'
                            style={{background: '#e64545'}}
                            onClick={closeModal}
                        >Annuler</button>
                    </div>
                </div>
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
    width:'40vw',
    height:'15vh',
    color: '#444444',
    padding: '10px'
  },
  overlay: {
    position: 'fixed',
    zIndex: 50,
    background: 'rgba(155, 155, 155, 0.8)'
  }
};

export default ArticleDeleteModal