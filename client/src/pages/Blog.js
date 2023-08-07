import { useSelector } from "react-redux";
import ArticleDetails from "../components/ArticleDetails";
import ArticleEditorModal from "../components/ArticleEditorModal";
import { useEffect, useState } from "react";

const Blog = () => {
    const { articles } = useSelector((store) => store.articles)
    const [ artWithImgs, setArtWithImgs ] = useState([])

    useEffect(()=>{
        async function fetchImages() {
            articles.map( async article =>{
                if(article.photo_files){
                    await fetch('/api/v1/getBlogImg/',{
                        method: 'POST',
                        body: JSON.stringify({photoFile: article.photo_files}),
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    })
                    .then(async response =>{
                        await response.blob()
                        .then( async blob => {
                            let photo = URL.createObjectURL(blob)
                            console.log('refresh');
                            setArtWithImgs(artWithImgs => [...artWithImgs, { ...article, photo: photo}])
                        })
                    })
                }else{
                    setArtWithImgs(artWithImgs => [...artWithImgs, { ...article, photo: ''}])
                }
            })
        }
        setArtWithImgs([])
        fetchImages()
        // eslint-disable-next-line
      },[articles])

    return (
        <div className="blog">
            <ArticleEditorModal 
                    type= {'create'}
                />
            <div className="article">
                {artWithImgs && 
                    artWithImgs
                    .sort((a, b) => a.id > b.id ? 1 : -1)
                    .map((artWithImg) => (
                        <ArticleDetails 
                            key={artWithImg.id} {...artWithImg} 
                        />
                ))}
            </div>
        </div>
    )
}

export default Blog