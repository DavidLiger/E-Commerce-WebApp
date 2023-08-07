import { useState, useRef } from "react"
import { store } from '../../store';
import 'react-phone-number-input/style.css'
import PhoneInput from 'react-phone-number-input/input'
import {
    AiOutlineEye,
    AiOutlineEyeInvisible
}from "react-icons/ai";

const Signup = () => {
    const { repairFile } = store.getState().repairFile;
    const { path } = store.getState().path;
    const { photos } = store.getState().photos;
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [adress, setAdress] = useState('')
    const [zipcode, setZipcode] = useState('')
    const [cities, setCities] = useState([])
    const [city, setCity] = useState('')
    const [phone, setPhone] = useState('')
    const [error, setError] = useState(null)
    const [success, setSuccess] = useState(null)
    const [isLoading, setIsLoading] = useState(null)
    const [show,setshow]=useState(false)
    const pass = useRef();

    const handleSubmit = async (e) => {
        e.preventDefault()
        // TODO : add cityName and cityGeoLoc
        const cityName = city.name
        const cityGeoLoc = JSON.stringify(city.geoloc)
        const phoneNumber = formatPhoneNumber(phone)
        const user = {email, password, firstName, lastName, adress, zipcode, cityName, cityGeoLoc, phoneNumber}
        const response = await fetch('/api/v1/user/signup',{
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
            localStorage.setItem('repairFile', JSON.stringify(repairFile))
            localStorage.setItem('photos', JSON.stringify(photos))
            localStorage.setItem('path', JSON.stringify(path))
            setIsLoading(false)
            setError(null)
            setSuccess(json.success)
        }
    }

    const handleZipCode = async (code) => {
        const apiUrl = 'https://geo.api.gouv.fr/communes?codePostal=';
	    const format = '&format=geojson';
        let url = apiUrl + code + format;
        const response = await fetch( url )
        const json = await response.json()
        let nextId = 0
        setCities([])
        const zipCities = []
        if(json){
            json.features.forEach(city => {
                zipCities.push({id: nextId++, name: city.properties.nom, geoloc: city.geometry.coordinates})
            });
        }
        zipCities.forEach(city=>setCities(cities=>[...cities, city]))
        setZipcode(code)
        setCity(zipCities[0])
    }

    const handleCity = async (id) => {
        setCity(cities[id])
    }

    const showpassword = (e) =>{
        e.preventDefault()
        setshow(!show)
            pass.current.type = show ? 'password':'text';
    }

    const formatPhoneNumber = phone => {
        if(phone.substring(0, 3) == '+33'){
            return phone.replace("+33", "0")
        }
    }

    return (
        <div 
        className="center"
        // style={{position: 'absolute',width:'100%',height: '100%', maxHeight:'700px', overflowY:'scroll'}}
        >
            <form className="signup" onSubmit={handleSubmit}>
                <h3>Créer un compte</h3>
                <label>Email:</label>
                <input 
                    type="email"
                    onChange={(e) => setEmail(e.target.value)}
                    value={email}
                />
                <label>Mot de passe:</label>
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
                <label>Prénom:</label>
                <input 
                    type="text"
                    onChange={(e) => setFirstName(e.target.value)}
                    value={firstName}
                />
                <label>Nom:</label>
                <input 
                    type="text"
                    onChange={(e) => setLastName(e.target.value)}
                    value={lastName}
                />
                <label>Adresse:</label>
                <input 
                    type="text"
                    onChange={(e) => setAdress(e.target.value)}
                    value={adress}
                />
                <label>Code Postal:</label>
                <input 
                    type="text"
                    onChange={(e) => handleZipCode(e.target.value)}
                    // value={zipcode}
                />
                <label>Ville:</label>
                <select className="citySelect" onChange={(e) => handleCity(e.target.value)}>
                    {cities === '' && <option value="1">Entrez un Code Postal</option>}
                    {cities.map((city)=>(
                            <option key={city.id} value={city.id}>{city.name}</option>
                        ))
                    }
                </select>
                <label>Telephone:</label>
                <PhoneInput
                    country="FR"
                    value={phone}
                    onChange={setPhone} 
                />
                <div style={{height:35}}>
                    <button style={{float:"right"}} disabled={isLoading} onClick={handleSubmit}>Enregistrer</button>
                </div>
                {error && <div className="error">{error}</div>}
                {success && <div className="success">{success}</div>}
            </form> 
        </div>          
    )
}

export default Signup