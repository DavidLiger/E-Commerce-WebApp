import React, { useCallback, useEffect, useState } from "react";
import TrashIcon from '../assets/images/trash_icon_white.png'
import ImageViewer from 'react-simple-image-viewer';
import { useDispatch, useSelector } from "react-redux";
import { createPhoto, removePhoto } from "../features/photosSlice";
import { store } from '../store';
import { addPhotoFile, removePhotoFile } from "../features/repairFileSlice";

const UploadAndDisplayImage = () => {
  
  const { user } = useSelector((store) => store.user)
  const [ images, setImages ] = useState([]);
  const [ alreadyImport, setAlreadyImported ] = useState(false)
  const [ currentImage, setCurrentImage ] = useState(0);
  const [ isViewerOpen, setIsViewerOpen ] = useState(false);
  const [ imageFiles, setImageFiles ] = useState([]);
  const dispatch = useDispatch()

  useEffect( ()=> {
    const { photos } = store.getState().photos
    if(photos){
      photos.forEach(photo => {
        setImageFiles(imageFiles => [...imageFiles, photo])
        setImages(images => [...images, photo.photo])
      })
    }
    // eslint-disable-next-line
}, [])

  const handleDelete = async (name, index) => {
    setImageFiles(imageFiles.filter(item => item.name !== name))
    setImages([
      ...images.slice(0, index),
      ...images.slice(index + 1, imageFiles.length)
    ])
    dispatch(removePhoto(name))
    // delete on server at /public/temp/repairFileImages
    let imgName = user.user._id + '_' + name
    await fetch('/api/v1/manageImg/' + imgName, {
        method: 'DELETE',
        headers: {
            'Authorization':`Bearer ${user.token}`
        }
    }).then(() => {
      dispatch(removePhotoFile(imgName))
    })
  }

  const handleAdd = async (event) => {
    setAlreadyImported(false)
    const photo = URL.createObjectURL(event.target.files[0])
    const name = event.target.files[0].name
    const image = { photo, name }
    if(!containsObject(image, imageFiles)){
      setImageFiles(imageFiles => [...imageFiles, image])
      dispatch(createPhoto(image))
      setImages(images => [...images, photo])
      // save on server in /public/temp/repairFileImages
      let imgName = user.user._id + '_' + name
      await fetch('/api/v1/uploadImg/' + imgName,{
          method: 'POST',
          body: event.target.files[0],
          headers: {
              'Content-Type': 'image/jpg',
              'Authorization':`Bearer ${user.token}`
          }
      }).then(() => {
        dispatch(addPhotoFile(imgName))
      })
    }else{
      setAlreadyImported(true)
    }
  }

  const containsObject = (obj, list) => {
    return list.some(elem => elem.name === obj.name)
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
    <div style={{width:'70%', marginLeft:'15%', marginTop:'3%'}}>
        <label style={{marginLeft:'14%'}}>Importer des photos</label>
        <div  style={ images.length > 0 ? 
                      {display:'flex', flexDirection:'row', overflowX:'scroll'} :
                      {display:'flex', flexDirection:'row', overflowX:'hidden'}
                    }>
        {imageFiles && imageFiles.map((item, index)=>(
                <div key={index} style={{display:'flex', position:'relative', margin:'10px'}}>
                    <img
                    style={{borderRadius:'6px', height:'90%', cursor:'pointer'}}
                      alt="not found"
                      width={"250px"}
                      src={imageFiles[index].photo}
                      onClick={ () => openImageViewer(index) }
                    />
                    <button
                      style={{
                        width:'35px', 
                        height:'30px', 
                        position:'absolute',
                        right:'0', 
                        marginTop:'5px', 
                        marginRight:'5px', 
                        cursor:'pointer',
                        backgroundColor:'rgba(255,0,0,0.6)',
                        borderStyle:'none', borderRadius:'6px'
                      }}
                      onClick={() => handleDelete(item.name, index)}>
                      <img src={TrashIcon} alt="TrashIcon" style={{width:'90%', height:'90%', padding:'1px'}}/>
                    </button>
                    <span style={{ 
                        position:'absolute',
                        bottom:'0', fontSize:'0.7em',height:'10%' }}>{item.name}</span>
                </div>
            )
        )}
        </div>
        {alreadyImport && 
          <span style={{color:'red', fontSize:'0.9em'}}>Vous avez déjà importer cette image.</span>
        }
        {isViewerOpen && (
          <ImageViewer
            src={ images }
            currentIndex={ currentImage }
            disableScroll={ false }
            closeOnClickOutside={ true }
            onClose={ closeImageViewer }
            backgroundStyle={{position:'fixed', zIndex:'60', backgroundColor:'rgba(125,125,125,0.7)'}}
          />
        )}
      <input
        type="file"
        name="myImage"
        onChange={(event) => {handleAdd(event)}}
      />
    </div>
  );
};

const uploaderStyle = {
    display:'flex',

}

export default UploadAndDisplayImage;