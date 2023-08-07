import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { getRepairFiles } from "../features/repairFileSlice"
import { useNavigate } from "react-router-dom"
import { getArticles } from "../features/articlesSlice"

const Admin = () => {

    const { user } = useSelector((store) => store.user)
    const { repairFiles } = useSelector((store) => store.repairFile)
    const { articles } = useSelector((store) => store.articles)
    const dispatch = useDispatch()
    const navigate = useNavigate()

    useEffect(() => {
        if(!repairFiles){
            dispatch(getRepairFiles(user))
        }
        if(!articles){
            dispatch(getArticles(user))
        }
        // eslint-disable-next-line
    }, [])

    const handleFilesClick = () => {
        navigate('/admin-files')
    }

    const handleDatesClick = () => {
        navigate('/admin-dates')
    }

    const handleBlogClick = () => {
        navigate('/blog')
    }

    return (
        <div className="adminContainer">
            <div 
                className="admin"
                onClick={handleFilesClick}
                >
                <h3 style={{margin: 0}}>Dossiers</h3>
                {repairFiles &&
                    <div style={{display: 'flex', width:'100%', flexDirection:'row', alignItems:'center', justifyContent:'center'}}>
                        <p>{repairFiles.length}</p>
                        {repairFiles.length > 1 ? <p style={{textIndent: '10px'}}>dossiers</p> : <p style={{textIndent: '10px'}}> dossier</p>}
                    </div>
                }
            </div>
            <div 
                className="admin"
                style={{backgroundColor: '#b2e743'}}
                onClick={handleDatesClick}
                >
                <h3 style={{ display: 'flex', alignItems: 'center', justifyContent: 'center'}}>Rdv téléphonique</h3>
                {repairFiles &&
                    <div style={{display: 'flex', width:'100%', flexDirection:'row', alignItems:'center', justifyContent:'center'}}>
                        <p>{repairFiles.length}</p>
                        {repairFiles.length > 1 ? <p style={{textIndent: '10px'}}>rendez-vous</p> : <p style={{textIndent: '10px'}}>rendez-vous</p>}
                    </div>
                }
            </div>
            <div 
                className="admin"
                style={{backgroundColor: '#b2e743'}}
                onClick={handleBlogClick}
                >
                <h3 style={{ display: 'flex', alignItems: 'center', justifyContent: 'center'}}>Blog</h3>
                {repairFiles &&
                    <div style={{display: 'flex', width:'100%', flexDirection:'row', alignItems:'center', justifyContent:'center'}}>
                        <p>{repairFiles.length}</p>
                        {repairFiles.length > 1 ? <p style={{textIndent: '10px'}}>rendez-vous</p> : <p style={{textIndent: '10px'}}>rendez-vous</p>}
                    </div>
                }
            </div>
        </div>
    )
}

export default Admin