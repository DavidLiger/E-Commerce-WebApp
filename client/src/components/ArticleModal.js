import React, { useState } from 'react';
import Modal from 'react-modal';

import CloseCross from '../assets/images/close_cross.png'

Modal.setAppElement('#root');

const ArticleModal = (props) => {
  const [modalIsOpen, setIsOpen] = useState(false);

  const openModal = () => {
    setIsOpen(true);
  }

  const closeModal = () => {
    setIsOpen(false);
  }

  const setCreatedDate = (date) => {
    let dateFormatted = date.split('T')[0]
    dateFormatted = dateFormatted.split('-')
    dateFormatted = `${dateFormatted[2]}/${dateFormatted[1]}/${dateFormatted[0]}`
    return dateFormatted
  }

  const setPreviewText = (text) => {
    let previewText = text.split(' ')
    previewText = previewText.slice(0, 7)
    previewText.push('...')
    previewText = previewText.join(' ')
    return previewText
  }

  return (
    <div className="articlePreview">
      <button 
        style={{width: '100%',padding: '10px',fontSize:'1.2em', borderRadius:'6px', borderStyle:'none', cursor:'pointer'}} 
        onClick={openModal}
      >
            <img
                style={{borderRadius:'6px', cursor:'pointer', position: 'relative', width: '100%', height: 'auto'}}
                alt="not found"
                src={props.artWithImg.photo}
            />
            <div style={{display: 'flex', flexDirection: 'row'}}>
                <div className="articlePreviewSubject">{props.artWithImg.subject}</div>
                <div className="articlePreviewDate">{setCreatedDate(props.artWithImg.createdAt)}</div>
            </div>
            <div className="articlePreviewTitle">{props.artWithImg.title}</div>
             <div className="articlePreviewText">{setPreviewText(props.artWithImg.text)}</div>
        {/* </div> */}
      </button>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={customStyles}
      >
        <div style={{display: 'flex', flexDirection: 'row', height:'10%', overflow: 'hidden'}}>
            <div style={{ width: '95%', display: 'flex', justifyContent: 'center', fontSize: '1.8em', fontWeight:'bold'}}>
                {props.artWithImg.title}
            </div>
            <div style={{ width: '5%'}}>
                <img style={{width:30, marginBottom:'25px', cursor:'pointer', float:'right'}}
                    src={CloseCross}
                    alt="909"
                    onClick={closeModal}
                />
            </div> 
        </div>
        <div style={customStyles.article}>
            <div style={{height: '40%', display: 'flex', justifyContent: 'center'}}>
                <img
                    style={{borderRadius:'6px', cursor:'pointer', position: 'relative', height: '100%'}}
                    alt="not found"
                    src={props.artWithImg.photo}
                />
            </div>
            <div style={{width : '100%', height: '10%', display: 'flex', flexDirection: 'row', alignItems: 'center', fontSize: '0.9em', fontWeight: 'bold', color: '#202020'}}>
                <div style={{width : '50%', display: 'flex', justifyContent: 'flex-start'}}>Sujet : {props.artWithImg.subject}</div>
                <div style={{width : '50%', display: 'flex', justifyContent: 'flex-end'}}>Ecrit le : {setCreatedDate(props.artWithImg.createdAt)}</div>
            </div>
            <div style={{height: '50%', display: 'flex', overflowY: 'scroll', whiteSpace: 'pre-line'}}>
                {props.artWithImg.text}
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
    width:'80vw',
    height:'80vh',
    color: '#444444'
  },
  overlay: {
    position: 'fixed',
    zIndex: 50,
    background: 'rgba(115, 115, 115, 0.8)'
  },
  article: {
    fontSize: '1.1em', 
    display: 'flex', 
    justifyContent: 'space-around', 
    flexDirection: 'column',
    marginTop:'2vh', 
    height:'90%'
  }
};

export default ArticleModal