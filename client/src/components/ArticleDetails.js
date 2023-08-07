import { useDispatch, useSelector } from "react-redux"
import { removeArticle } from "../features/articlesSlice"
import ArticleEditorModal from "../components/ArticleEditorModal";
import ArticleDeleteModal from "../components/ArticleDeleteModal";

const ArticleDetails = ({id, subject, title, text, photo, photo_files, createdAt}) => {
    const dispatch = useDispatch()
    const { user } = useSelector((store) => store.user)

    const handleDeleteClick = async () => {
        if(!user){
            return
        }
        const response = await fetch('/api/v1/article/' + id, {
            method: 'DELETE',
            headers: {
                'Authorization':`Bearer ${user.token}`
            }
        })
        const json = await response.json()
        if (json.success){
            await fetch('/api/v1/manageBlogImg/' + photo_files, {
                method: 'DELETE',
                headers: {
                    'Authorization':`Bearer ${user.token}`
                }
            })
            dispatch(removeArticle(id))
        }
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

    return(
        <div className="article-details">
            <div>
                <h4>{title}</h4>
                <p><strong>Sujet: </strong>{subject}</p>
                <p><strong>Texte: </strong>{setPreviewText(text)}</p>
                <p>{setCreatedDate(createdAt)}</p>
            </div>
            <div style={{display: "flex", flexDirection: "column", justifyContent: "space-between", alignItems: "flex-end"}}>
                {/* <button className="article-details-delete" onClick = {handleDeleteClick}></button> */}
                <ArticleDeleteModal
                    title= {title}
                    handleDeleteClick={handleDeleteClick}
                />
                <ArticleEditorModal 
                    id= {id}
                    subject= {subject}
                    title= {title}
                    text= {text}
                    photo = {photo}
                    photoName = {photo_files}
                    createdAt= {createdAt}
                    type= {'update'}
                />
            </div>
        </div>
    )
}

export default ArticleDetails