import React, { useState } from 'react';
import Modal from 'react-modal';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from "react-redux"
import { setPath } from '../features/pathSlice';


import CloseCross from '../assets/images/close_cross.png'
import { useEffect } from 'react';

Modal.setAppElement('#root');

const LoginModal = (props) => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [modalIsOpen, setIsOpen] = useState(false);

  useEffect( ()=> {
    setIsOpen(props.open)
    // eslint-disable-next-line
  }, [props])

  const closeModal = () => {
    props.handleCloseModal()
    setIsOpen(false);
  }

  const navigateToLogin = () => {
    navigate("/login")
    dispatch(setPath({path:'/rendez-vous'}))
  }

  const navigateToSignIn = () => {
    navigate("/signup")
    dispatch(setPath({path:'/rendez-vous'}))
  }

  return (
    <div className='center'>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={customStyles}
      >
        <div style={{display: 'flex', justifyContent: 'flex-end'}}>
          <img style={{width:30, marginBottom:'25px', cursor:'pointer'}}
                        src={CloseCross}
                        alt="909"
                        onClick={closeModal}
                    />
        </div>
        <div style={{fontSize: '1.1em'}}>Afin de continuer, merci de vous inscrire </div>
        <div style={{fontSize: '1.1em', display: 'flex', justifyContent: 'space-around'}}>ou de vous connecter</div>
        <div style={{display: 'flex', justifyContent: 'space-around', marginTop: '40px'}}>
          <button className='modalButton' onClick={navigateToLogin}>Se connecter</button>
          <button className='modalButton' onClick={navigateToSignIn}>Créer un compte</button>
        </div>
        
      </Modal>
    </div>
  )
}

const customStyles = {
  content: {
    position: 'fixed',
    display: 'flex',
    flexDirection: 'column',
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    zIndex: 90
  },
  overlay: {
    position: 'fixed',
    zIndex: 20,
    background: 'rgba(255, 255, 255, 0.5)'
  },
};

export default LoginModal