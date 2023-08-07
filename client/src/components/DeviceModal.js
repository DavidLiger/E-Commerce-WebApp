import React, { useState } from 'react';
import Modal from 'react-modal';
import { setRepairFile } from '../features/repairFileSlice';
import { useDispatch } from 'react-redux';

Modal.setAppElement('#root');

const DeviceModal = (props) => {
  const [ modalIsOpen, setIsOpen ] = useState(false);
  const [ subcategories, setSubcategories ] = useState([])
  const dispatch = useDispatch()

  const openModal = () => {
    setIsOpen(true);
  }

  const closeModal = () => {
    setIsOpen(false);
  }

  const handleCategoryIconClicked = async (name, category) => {
        if(props.item.json.length > 1){
            if(subcategories.length == 0){
                props.item.json.map( item => {
                    setSubcategories(subcategories => [...subcategories, item])
                }) 
            }
            openModal()
        }else{
            console.log(name);
            let id = props.item.json[0].id
            dispatch(setRepairFile({device: {id, name}}))
            dispatch(setRepairFile({category: category}))
            reset()
        }
        props.setCategory(name)
        props.setSelectedIcon(name)
    }

    const setExactDevice = (id, name, category) => {
        dispatch(setRepairFile({device: {id, name}}))
        dispatch(setRepairFile({category: category}))
        reset()
        closeModal()
    }

    const reset = () => {
        dispatch(setRepairFile({selectedOffer: ''}))
        dispatch(setRepairFile({selectedRef: ''}))
        dispatch(setRepairFile({advices: ''}))
        dispatch(setRepairFile({issue: ''}))
        dispatch(setRepairFile({serialNumber: ''}))
        dispatch(setRepairFile({comment: ''}))
        dispatch(setRepairFile({phoneAppointment: ''}))
        dispatch(setRepairFile({selectedTimeSlotRef: ''}))
    }

  return (
    <div >
      <button 
        className='categoryIcon'
        onClick={()=>{handleCategoryIconClicked(props.item.name, props.item.category)}}
      >
            <img 
                style={ props.item.selected ? {backgroundColor: '#b5f3ca'} : {backgroundColor: 'rgba(255,255,255,0)'}}
                src={require(`../assets/images/${props.item.icon}`)}
                alt="VaccumCleaner"/>
            <p style={{cursor: 'pointer'}}>{props.item.name}</p>
      </button>
      <Modal
        isOpen={modalIsOpen}
        style={customStyles}
      >
        <div style={{display: 'flex', flexDirection: 'column'}}>
            <span style={{margin: '12px'}}>Merci de choisir une option : </span>
            {subcategories.length > 0 && subcategories.map((subCategory, index) => {
                return <button 
                            key={index}
                            onClick={() => {setExactDevice(subCategory.id, props.item.name, props.item.category)}}
                            style={customStyles.button}
                        >{subCategory.subcategory}
                        </button>
            })}
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
    padding: '15px',
    color: '#444444'
  },
  overlay: {
    position: 'fixed',
    zIndex: 50,
    background: 'rgba(115, 115, 115, 0.8)'
  },
  button: {
    background: '#1aac83',
    color: '#fff',
    border: '2px solid #1aac83',
    padding: '6px 10px',
    borderRadius: '4px',
    fontFamily: "Poppins",
    cursor: 'pointer',
    fontSize: '1em',
    marginLeft: '10px',
    margin: '12px'
  }
};

export default DeviceModal