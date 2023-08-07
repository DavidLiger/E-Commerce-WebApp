import React, { useState } from 'react';
import Modal from 'react-modal';

import CloseCross from '../assets/images/close_cross.png'
import { useSelector } from 'react-redux';
import { TbPhoneCall } from "react-icons/tb";
import ReactSimpleImageViewer from 'react-simple-image-viewer';
import { useCallback } from 'react';


Modal.setAppElement('#root');

const FileModal = (props) => {

  const { user } = useSelector((store) => store.user)
  const [modalIsOpen, setIsOpen] = useState(false);
  const [ intervention, setIntervention ] = useState()
  const [ images, setImages ] = useState([])
  const [ imageDetails, setImageDetails ] = useState([])
  const [ currentImage, setCurrentImage ] = useState(0);
  const [ isViewerOpen, setIsViewerOpen ] = useState(false);

  const openModal = async () => {
    await fetch('/api/v1/repairfile/' + props.id,{
      method: 'GET',
      headers: {
          'Content-Type': 'application/json',
          'Authorization':`Bearer ${user.token}`
      }
    })
    .then( async response =>{
      await response.json()
      .then(json => {
          if(json){
            setIntervention(json)
            if(images.length == 0 && json.photo_files){
              getPhotoFiles(json.photo_files, json.id)
            }
            setIsOpen(true);
          }
        })
    })
  }

  const closeModal = () => {
    setIsOpen(false);
  }

  const setPhoneNumber = (phonenumber) => {
    let phoneNumber = []
    // let numbers = phonenumber.substring(3, phonenumber.length).split('')
    let numbers = phonenumber.split('')
    // numbers.unshift('0')
    numbers.map((number,index) => {
      if(index % 2 != 0){
        phoneNumber.push(numbers[index-1] + number)
      }
    })
    return phoneNumber.join(' ')
  }

  const setTimeSlot = (timeSlot) => {
    console.log(timeSlot);
    if(timeSlot == 'morning'){
      return 'matin'
    }else{
      return 'après-midi'
    }
  }

  const getPhotoFiles = async (photoFiles, id) => {
    let files = photoFiles.split(',')
    files.map( async (photoFile) => {
        const response = await fetch('/api/v1/getImg/',{
            method: 'POST',
            body: JSON.stringify({photoFile: photoFile, id: id}),
            headers: {
                'Content-Type': 'application/json',
                'Authorization':`Bearer ${user.token}`
            }
        })
        const blob = await response.blob()
        if(blob){
          let photo = URL.createObjectURL(blob)
          let name = photoFile.split('_')
          name = name.slice(1).join('_').toString()
          let image = { photo, name }
          setImages(images => [...images, image])
          setImageDetails(imageDetails => [...imageDetails, photo])
        }
    })
  }

  const openImageViewer = useCallback((index) => {
    setCurrentImage(index);
    setIsViewerOpen(true);
  }, []);

  const closeImageViewer = () => {
    setCurrentImage(0);
    setIsViewerOpen(false);
  };

  return (
    <div style={{width:'70vw', height:'5vh', marginLeft:'5vw', marginTop:'3vh'}}>
      <button 
        style={{...customStyles.button, 
                ...props.selected ? 
                {backgroundColor: '#b5f3ca'} : 
                {backgroundColor: 'rgba(255,255,255,0.7)'}}}
        id='repairButton' 
        onClick= {()=>{openModal()}}>
            <div style={{left:'15px', position:'absolute'}}>
              {props.id}
            </div>
            <div>
              {props.firstName} {props.lastName}
            </div>
            {props.phoneAppointment &&
              <div style={{...customStyles.buttonDateRDV,
                backgroundColor: props.phoneAppointment[1],
                color:'#3b3b3b'
              }}>
                {props.phoneAppointment[0] != '' &&
                  <TbPhoneCall style={{marginRight:'10px', fontSize:'1.2em'}}/>
                }
                <span style={{fontSize:'0.8em'}}>{props.phoneAppointment[0]}</span>
              </div>
            }
      </button>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={customStyles}
      >
        <div style={{display: 'flex', justifyContent: 'center', position:'relative', overflow:'hidden'}}>
          <div style={{fontSize: '1.4em', fontWeight:'bold', position:'absolute'}}>Dossier n° {props.id}</div>
          <img 
            style={{width:30, marginBottom:'25px', cursor:'pointer', right:'5px', position:'absolute'}}
            src={CloseCross}
            alt="909"
            onClick={closeModal}/>
          {intervention && 
            <div style={{marginTop:'7vh', width:'90%', overflowY:'scroll', overflowX:'hidden'}}>
              <div style={{display:'flex', flexDirection:'row', justifyContent:'center', marginTop:'2vh', marginBottom:'2vh', fontSize: '1.1em'}}>
                <span style={{fontWeight:'bold'}}>Client : </span>
                <span style={{marginLeft:'5px'}}>{intervention.first_name} {intervention.last_name}</span>
              </div>
              <div style={{display:'flex', flexDirection:'row', left:'2vw'}}>
                <span style={{fontWeight:'bold'}}>Adresse : </span>
                <span style={{marginLeft:'5px'}}>{intervention.adress} {intervention.zipcode} {intervention.city_name} </span>
              </div>
              <div style={{display:'flex', flexDirection:'row', left:'2vw'}}>
                <span style={{fontWeight:'bold'}}>Email : </span>
                <span style={{marginLeft:'5px'}}>{intervention.email}</span>
              </div>
              <div style={{display:'flex', flexDirection:'row', left:'2vw'}}>
                <span style={{fontWeight:'bold'}}>Téléphone : </span>
                <span style={{marginLeft:'5px'}}>{setPhoneNumber(intervention.phone_number)}</span>
              </div>
              <div style={{display:'flex', flexDirection:'row', justifyContent:'center', marginTop:'2vh', marginBottom:'2vh', fontSize: '1.1em'}}>
                <span style={{fontWeight:'bold'}}>Appareil</span>
              </div>
              <div style={{display:'flex', flexDirection:'row', left:'2vw'}}>
                <span style={{fontWeight:'bold'}}>Type : </span>
                <span style={{marginLeft:'5px'}}>{intervention.name}</span>
              </div>
              <div style={{display:'flex', flexDirection:'row', left:'2vw'}}>
                <span style={{fontWeight:'bold'}}>Marque : </span>
                <span style={{marginLeft:'5px'}}>{intervention.brand}</span>
              </div>
              {intervention.serial_number &&
                <div style={{display:'flex', flexDirection:'row', left:'2vw'}}>
                  <span style={{fontWeight:'bold'}}>N° de série : </span>
                  <span style={{marginLeft:'5px'}}>{intervention.serial_number}</span>
                </div>
              }
              {intervention.comment &&
                <div style={{display:'flex', flexDirection:'row', left:'2vw'}}>
                  <span style={{fontWeight:'bold'}}>Commentaire : </span>
                  <span style={{marginLeft:'5px'}}>{intervention.comment}</span>
                </div>
              }
              <div style={{display:'flex', flexDirection:'row', left:'2vw'}}>
                <span style={{fontWeight:'bold'}}>Panne : </span>
                <span style={{marginLeft:'5px'}}>{intervention.issue}</span>
              </div>
              <div style={{display:'flex', flexDirection:'row', justifyContent:'center', marginTop:'2vh', marginBottom:'2vh', fontSize: '1.1em'}}>
                <span style={{fontWeight:'bold'}}>Intervention</span>
              </div>
              <div style={{display:'flex', flexDirection:'row', left:'2vw'}}>
                <span style={{fontWeight:'bold'}}>Agence : </span>
                <span style={{marginLeft:'5px'}}>{intervention.agency}</span>
              </div>
              <div style={{display:'flex', flexDirection:'row', left:'2vw'}}>
                <span style={{fontWeight:'bold'}}>Type : </span>
                <span style={{marginLeft:'5px'}}>{intervention.intervention_type == 'remote' ? 'Diagnostic à distance' : intervention.intervention_type}</span>
              </div>
              {intervention.phone_appointment != 'noRdv' &&
                <div style={{display:'flex', flexDirection:'row', left:'2vw'}}>
                  <span style={{fontWeight:'bold'}}>Date rdv téléphonique : </span>
                  <span style={{marginLeft:'5px'}}>{intervention.phone_appointment}</span>
                </div>
              }{intervention.phone_appointment != 'noRdv' &&
                <div style={{display:'flex', flexDirection:'row', left:'2vw'}}>
                  <span style={{fontWeight:'bold'}}>Plage horaire rdv téléphonique : </span>
                  <span style={{marginLeft:'5px'}}>
                    {
                      intervention.time_slot != 12 ?
                      <span>{intervention.time_slot} h - {Number(intervention.time_slot) + 1} h</span> :
                      <span>{intervention.time_slot} h - {14} h</span>
                    }
                  </span>
                </div>
              }
              {images.length > 0 &&
                <div style={{display:'flex', flexDirection:'row', left:'2vw', justifyContent:'space-around', overflowX:'scroll'}}>
                  {images && images.map((item, index)=>(
                          <div key={index} style={{display:'flex', position:'relative', margin:'10px'}}>
                              <img
                              style={{borderRadius:'6px', height:'90%', cursor:'pointer'}}
                                alt="not found"
                                width={"250px"}
                                src={images[index].photo}
                                onClick={ () => openImageViewer(index) }
                              />
                              <span style={{ 
                                  position:'absolute',
                                  bottom:'0', fontSize:'0.7em',height:'10%' }}>{item.name}</span>
                          </div>
                      )
                  )}
                </div>
              }
            </div>
          }
        </div>
        <div style={{fontSize: '1.1em', display: 'flex', justifyContent: 'space-around', marginTop:'2vh'}}>{props.advice}</div>
      </Modal>
              {isViewerOpen && (
                <ReactSimpleImageViewer
                  src={ imageDetails }
                  currentIndex={ currentImage }
                  disableScroll={ false }
                  closeOnClickOutside={ true }
                  onClose={ closeImageViewer }
                  backgroundStyle={{position:'fixed', zIndex:'60', backgroundColor:'rgba(125,125,125,0.7)'}}
                />
              )}
    </div>
  )
}

const customStyles = {
    button: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        position:'relative',
        fontSize:'1.2em', 
        borderRadius:'6px', 
        borderStyle:'none', 
        backgroundColor:'rgba(255, 255, 255, 0.5)',
        width:'100%',
        height:'100%', 
        cursor:'pointer'
    },
    content: {
        display: 'flex',
        flexDirection: 'column',
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        width:'60vw',
        height:'70vh'
    },
    overlay: {
        position: 'fixed',
        zIndex: 50,
        background: 'rgba(255, 255, 255, 0.5)'
    },
    buttonDateRDV: {
      right:'10px', 
      position:'absolute', 
      display:'flex', 
      justifyContent:'center', 
      alignItems:'center',
      padding: '5px',
      borderRadius: '4px'
    }
};

export default FileModal