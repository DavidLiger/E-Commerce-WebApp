import { useState } from "react"
// import { usearticlesContext } from "../hooks/usearticlesContext"
import { createArticle } from "../features/articlesSlice"
import { useDispatch, useSelector } from "react-redux"


// Update de la liste avec un refetch depuis le React Context
const ArticleForm = () => {
    const dispatch = useDispatch()
    const { user } = useSelector((store) => store.user)
    const [emptyFields, setEmptyFields] = useState([])
    const [subject, setSubject] = useState('')
    const [title, setTitle] = useState('')
    const [text, setText] = useState('')
    const [error, setError] = useState(null)

    const handleSubmit = async (e) => {
        e.preventDefault()
        if(!user){
            setError('You must be logged in')
            return
        }
        const article = {subject, title, text}
        const response = await fetch('/api/v1/article',{
            method: 'POST',
            body: JSON.stringify(article),
            headers: {
                'Content-Type': 'application/json',
                'Authorization':`Bearer ${user.token}`
            }
        })
        const json = await response.json()
        console.log(json);
        if(json.success){
            setEmptyFields([])
            setError(null)
            setSubject('')
            setTitle('')
            setText('')
            // console.log('new article added', json);
            // dispatch({type: 'CREATE_article', payload: json})
            dispatch(createArticle(json))
        }else{
            setEmptyFields(json.emptyFields)
            setError(json.error)
        }
    }

    return(
        <form className="create" onSubmit={handleSubmit}>
            <h3>Ajouter un article</h3>
            <label >Subject: </label>
            <input 
                type=""
                onChange={(e) => setSubject(e.target.value)}
                value={subject}
                className={emptyFields.includes('subject')? "error": ""}
            />
            <label >title: </label>
            <input 
                type=""
                onChange={(e) => setTitle(e.target.value)}
                value={title}
                className={emptyFields.includes('title') ? 'error' : ''}
            />
            <label >text: </label>
            <input 
                type=""
                onChange={(e) => setText(e.target.value)}
                value={text}
                className={emptyFields.includes('text') ? 'error' : ''}
            />
            <button >Valider</button>
            {error && <div className="error">{error}</div>}
        </form>
    )
}

export default ArticleForm