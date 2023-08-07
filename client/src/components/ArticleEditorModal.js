import React, { useEffect, useState } from 'react';
import Modal from 'react-modal';
import { useDispatch, useSelector } from 'react-redux';
import { getArticles } from '../features/articlesSlice';
import TrashIcon from '../assets/images/trash_icon_white.png'

Modal.setAppElement('#root');

const ArticleEditorModal = (props) => {
    const dispatch = useDispatch()
    const { user } = useSelector((store) => store.user)
    const [modalIsOpen, setIsOpen] = useState(false);
    const [subject, setSubject] = useState('')
    const [title, setTitle] = useState('')
    const [text, setText] = useState('')
    const [photo, setPhoto] = useState('')
    const [photoName, setPhotoName] = useState('')
    const [type, setType] = useState('')
    const [error, setError] = useState(null)

    console.log(photoName);

    useEffect(() => {
        if(props.title){
            setTitle(props.title)
        }
        if(props.subject){
            setSubject(props.subject)
        }
        if(props.text){
            setText(props.text)
        }
        if(props.photo){
            setPhoto(props.photo)
        }
        if(props.type){
            setType(props.type)
        }
        if(props.photoName){
            setPhotoName(props.photoName)
        }
    },[props])

    const handleSubmit = (e) => {
        if(type == 'create'){
            // console.log('create article');
            createArticle(e)
        }
        if(type == 'update'){
            // console.log('update article');
            updateArticle(e)
        }
    }

    const createArticle = async (e) => {
        e.preventDefault()
        console.log(photoName);
        const article = {subject, title, text, photoName}
        await fetch('/api/v1/article',{
            method: 'POST',
            body: JSON.stringify(article),
            headers: {
                'Content-Type': 'application/json',
                'Authorization':`Bearer ${user.token}`
            }
        })
        .then( async response => {
            await response.json()
            .then(async json => {
                if(json.success){
                    setError(null)
                    setSubject('')
                    setTitle('')
                    setText('')
                    closeModal()
                    dispatch(getArticles())
                    // console.log('new article added', json);
                }else{
                    setError(json.error)
                }
            })
        })
    }

    const updateArticle = async (e) => {
        e.preventDefault()
        let id = props.id
        const article = {id, subject, title, text, photo}
        await fetch('/api/v1/article/' + id ,{
            method: 'PUT',
            body: JSON.stringify(article),
            headers: {
                'Content-Type': 'application/json',
                'Authorization':`Bearer ${user.token}`
            }
        })
        .then( async response => {
            await response.json()
            .then(async json => {
                if(json.success){
                    setError(null)
                    setSubject('')
                    setTitle('')
                    setText('')
                    closeModal()
                    dispatch(getArticles())
                }else{
                    setError(json.error)
                }
            })
        })
    }

    const handleAdd = async (event) => {
        // setAlreadyImported(false)
        const image = URL.createObjectURL(event.target.files[0])
        const photo = event.target.files[0].name
        // const image = { photo, name }
        //   dispatch(createPhoto(image))
        if(type == 'update'){
            let id = props.id
            console.log(id);
            const article = {id, subject, title, text, photo}
            await fetch('/api/v1/article/' + id ,{
                method: 'PUT',
                body: JSON.stringify(article),
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization':`Bearer ${user.token}`
                }
            })
            .then( async response => {
                await response.json()
                .then(async json => {
                    if(json.success){
                        await fetch('/api/v1/uploadBlogImg/' + photo,{
                            method: 'POST',
                            body: event.target.files[0],
                            headers: {
                                'Content-Type': 'image/jpg',
                                'Authorization':`Bearer ${user.token}`
                            }
                        })
                        .then(() => {
                            setPhoto(image)
                            setPhotoName(photo)
                            dispatch(getArticles())
                        })
                    }
                })
            })
        }else{
            await fetch('/api/v1/uploadBlogImg/' + photo,{
                method: 'POST',
                body: event.target.files[0],
                headers: {
                    'Content-Type': 'image/jpg',
                    'Authorization':`Bearer ${user.token}`
                }
            })
            .then(() => {
                setPhoto(image)
                setPhotoName(photo)
                dispatch(getArticles())
            })
        }
      }

    const handleDelete = async () => {
        console.log(photoName);
        setPhoto('')
        let id = props.id
        const article = {id, subject, title, text, photoName}
        await fetch('/api/v1/article/' + id ,{
            method: 'PUT',
            body: JSON.stringify(article),
            headers: {
                'Content-Type': 'application/json',
                'Authorization':`Bearer ${user.token}`
            }
        })
        .then( async response => {
            await response.json()
            .then(async json => {
                if(json.success){
                    await fetch('/api/v1/manageBlogImg/' + photoName, {
                        method: 'DELETE',
                        headers: {
                            'Authorization':`Bearer ${user.token}`
                        }
                    })
                    .then(() => {
                        setPhoto('')
                        setPhotoName('')
                    })
                }
            })
        })
      }

    const openModal = () => {
        setIsOpen(true);
    }

    const closeModal = () => {
        setIsOpen(false);
    }

    return (
        <div>
            {type == 'update' ?
                <button 
                    className="article-details-update" 
                    onClick = {openModal}
                /> :
                <div 
                    className="newArticle"
                    onClick={openModal}
                >
                    Créer un nouvel article
                </div>
            }
        <Modal
            isOpen={modalIsOpen}
            onRequestClose={closeModal}
            style={customStyles}
        >
            <form className="create">
                { type == 'update' ? <h3>Modifier un article</h3> :<h3>Ajouter un article</h3> }
                {/* fetch image */}
                {photo &&
                    <div style={{display:'flex', position:'relative', justifyContent: 'center', width: '30%', margin:'10px'}}>
                        <img
                        style={{borderRadius:'6px', width: '100%', height:'auto', cursor:'pointer'}}
                        alt="not found"
                        width={"250px"}
                        src={photo}
                        // onClick={ () => openImageViewer(index) }
                        />
                        <button
                        style={{
                            width:'40px', 
                            height:'40px', 
                            position:'absolute',
                            right:'0', 
                            marginTop:'5px', 
                            marginRight:'5px', 
                            cursor:'pointer',
                            backgroundColor:'rgba(255,0,0,0.6)',
                            borderStyle:'none', borderRadius:'6px'
                        }}
                        onClick={() => handleDelete()}
                        >
                        <img src={TrashIcon} alt="TrashIcon" style={{width:'100%', height:'100%', padding:'1px'}}/>
                        </button>
                        <span style={{ 
                            position:'absolute',
                            bottom:'0', fontSize:'0.7em',height:'10%' }}>
                                {/* {item.name} */}
                        </span>
                    </div>
                }
                {          
                    <input
                        type="file"
                        name="myImage"
                        onChange={(event) => {handleAdd(event)}}
                    />
                }
                <label >Sujet: </label>
                <input 
                    type=""
                    onChange={(e) => setSubject(e.target.value)}
                    value={subject}
                />
                { subject == '' &&
                    <span className='warning center' style={{marginTop: '1vh', fontSize: '1em'}}>Merci de remplir le sujet</span>
                }
                <label >Titre: </label>
                <input 
                    type=""
                    onChange={(e) => setTitle(e.target.value)}
                    value={title}
                />
                { title == '' &&
                    <span className='warning center' style={{marginTop: '1vh', fontSize: '1em'}}>Merci de remplir le titre</span>
                }
                <label >Texte: </label>
                <input 
                    type=""
                    onChange={(e) => setText(e.target.value)}
                    value={text}
                />
                { text == '' &&
                    <span className='warning center' style={{marginTop: '1vh', fontSize: '1em'}}>Merci de remplir le texte</span>
                }
                <button onClick={handleSubmit}>Valider</button>
                <span onClick={closeModal}>Annuler</span>
                {error && <div className="error">{error}</div>}
            </form>
            
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

export default ArticleEditorModal