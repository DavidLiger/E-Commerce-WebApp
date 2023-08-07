import { useState, useRef } from "react"
import { useLocation, useNavigate } from "react-router-dom";
import {
    AiOutlineEye,
    AiOutlineEyeInvisible
}from "react-icons/ai";

const ForgotPassword = () => {
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [error, setError] = useState(null)
    const [message, setMessage] = useState(null);
    const [isLoading, setIsLoading] = useState(null)
    const [show,setshow]=useState(false)
    const pass = useRef();
    const useQuery = () => new URLSearchParams(useLocation().search);   
    const navigate = useNavigate(); 
    const query = useQuery();   
    const id = query.get('id');
    const token = query.get('token');

    const handleSubmit = async (e) => {
        e.preventDefault()
        const user = {id, token, password, confirmPassword}
        const response = await fetch('/api/v1/user/changePassword',{
            method: 'POST',
            body: JSON.stringify(user),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        const json = await response.json()
        if(response.ok){
            setIsLoading(false)
            setMessage('Mot de passe renouvelé ! Vous pouvez vous connecter')
            setError(null)
        }else{
            // setMessage(json.error)
            setIsLoading(false)
            setError(json.error)
        }
    }

    const routeChange = () =>{ 
        let path = `/login`
        navigate(path);
      }

    const showpassword = (e) =>{
        e.preventDefault()
        setshow(!show)
        pass.current.type = show ? 'password':'text';
    }

    return (
        <div>
            <form className="forgotPw">
                <h3 className="">Changement de mot de passe</h3>
                <label>Nouveau mot de passe:</label>
                <div className="passwordContainer" style={{display: 'flex', flexDirection: 'row'}}>
                    <input 
                        // style={{width:'75%'}}
                        className="passwordInput"
                        ref={pass} 
                        type = "password"
                        onChange={(e) => setPassword(e.target.value)}
                        value={password}
                    />
                    {show ? <span className="passwordImage" onClick={showpassword}><AiOutlineEyeInvisible style={{fontSize: '1.6em', cursor: 'pointer'}}/></span>:<span className="passwordImage" onClick={showpassword}><AiOutlineEye style={{fontSize: '1.6em', cursor: 'pointer'}}/></span>}
                </div>
                <label>Confirmation mot de passe:</label>
                <input 
                    type="password"
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    value={confirmPassword}
                />
                {!message &&
                    <button disabled={isLoading} onClick={handleSubmit}>Valider</button>
                }
                {error && <div className="error">{error}</div>}
                {message && 
                    <div className={error ? "forgotPWError" : "forgotPWSuccess"}>{message}
                        <button className="success" onClick={()=>{routeChange()}}>Login</button>
                    </div>
                }
            </form>
            
        </div>
    )
}

export default ForgotPassword