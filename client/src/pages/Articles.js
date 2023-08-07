import { useSelector } from "react-redux"
import { useEffect, useState } from "react";
import ArticleModal from "../components/ArticleModal";


const Articles = () => {
    const { articles } = useSelector((store) => store.articles)
    const [ artWithImgs, setArtWithImgs ] = useState([])

    useEffect(()=>{
        async function fetchImages() {
            articles.map( async article =>{
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
                        setArtWithImgs(artWithImgs => [...artWithImgs, { ...article, photo: photo}])
                    })
                })
            })
        }
        if(artWithImgs.length == 0){
            fetchImages()
        }
        // eslint-disable-next-line
      },[])

    return (
        <div className="articles">
            {artWithImgs && artWithImgs.map((artWithImg, index) => (
                    <ArticleModal 
                        key={index}
                        artWithImg={artWithImg}
                    />
                ))}
        </div>
    )
}

export default Articles