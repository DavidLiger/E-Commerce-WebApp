import { useState, useRef } from "react"
import { useDispatch } from "react-redux"
import { login } from "../../features/userSlice"
import {
    AiOutlineEye,
    AiOutlineEyeInvisible
}from "react-icons/ai";


const Login  = () => {
    const dispatch = useDispatch()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState(null)
    const [success, setSuccess] = useState(null)
    const [isLoading, setIsLoading] = useState(null)
    const [show,setshow]=useState(false)
    const pass = useRef();

    const handleSubmit = async (e) => {
        e.preventDefault()
        const user = {email, password}
        const response = await fetch('/api/v1/user/login',{
            method: 'POST',
            body: JSON.stringify(user),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        const json = await response.json()
        if(!response.ok){
            setIsLoading(false)
            setError(json.error)
        }else{
            // save the user to the local storage
            localStorage.setItem('user', JSON.stringify(json))
            // update the user state
            dispatch(login(json))
            setIsLoading(false)
            setError(null)
        }
    }

    const handleForgotPassword = async (e) => {
        e.preventDefault()
        const user = {email}
        if(!user.email){
            setError('Veuillez indiquer une adresse mail valide')
        }
        const response = await fetch('/api/v1/user/renewPassword',{
            method: 'POST',
            body: JSON.stringify(user),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        const json = await response.json()
        if(!response.ok){
            setIsLoading(false)
            setError(json.error)
        }else{
            setIsLoading(false)
            setError(null)
            setSuccess(json.success)
        }
    }

    const showpassword = (e) =>{
        e.preventDefault()
        setshow(!show)
            pass.current.type = show ? 'password':'text';
    }

    return (
        <div>
            <form className="login">
                <h3>S'identifier</h3>
                <label>Email address:</label>
                <input 
                    type="email"
                    onChange={(e) => setEmail(e.target.value)}
                    value={email}
                />
                <label>Password:</label>
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
                <button disabled={isLoading} onClick={handleSubmit}>Connexion</button>
                <button style={{backgroundColor:"lightblue",color:"grey", float: "right"}} onClick={handleForgotPassword}>Mot de passe oublié</button>
                <div className="redirectToSign">
                    <span>Pas encore inscrit ?</span>
                    <a style={{float: "right"}} href="/signup">Créer un compte</a>
                </div>
                {error && <div className="error">{error}</div>}
                {success && <div className="success">{success}</div>}
            </form>
            
        </div>
    )
}

export default Login