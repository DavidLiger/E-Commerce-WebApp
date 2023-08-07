import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

// URL coté server = `/api/v1/user/${id}/verify/${token}`

const VerifyAccount = () => {
    const [message, setMessage] = useState(null);
    const [error, setError] = useState(false);
    const useQuery = () => new URLSearchParams(useLocation().search);   
    const navigate = useNavigate(); 
    const query = useQuery();   
    const id = query.get('id');
    const token = query.get('token');

    useEffect(()=> {
        async function fetchData() {
            try {
                const response = await fetch('/api/v1/user/verify',{
                    method: 'POST',
                    body: JSON.stringify({id, token}),
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }, [])
                const json = await response.json()
                if(response.ok){
                    setMessage('Compte activé')
                    setError(false)
                }else{
                    setMessage(json.error)
                    setError(true)
                }
            } catch (error) {
            }
        }
        fetchData();
        // eslint-disable-next-line
    }, [])

    const routeChange = () =>{ 
        let path = `/login`
        navigate(path);
      }

    return(
        <div className="verify">
            {message && 
                    <div className={error ? "verifyError" : "verifySuccess"}>{message}
                        <button className="success" onClick={()=>{routeChange()}}>Login</button>
                    </div>
            }
        </div>
    )
}

export default VerifyAccount