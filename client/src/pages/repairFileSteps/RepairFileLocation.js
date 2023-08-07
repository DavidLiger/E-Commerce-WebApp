import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { setRepairFile } from "../../features/repairFileSlice"
import { store } from "../../store"
import Loading from '../../assets/images/loading.gif'


const RepairFileLocation = (props) => {
    const { agencies } = useSelector((store) => store.agencies)
    const agenciesList = JSON.parse(JSON.stringify(agencies));
    const [ zipcode, setZipcode ] = useState('')
    const [ cities, setCities ] = useState([])
    const [ isLoading, setIsLoading ] = useState(false)
    const [ selectedCityId, setSelectedCityId ] = useState(0)
    const [ reloadCity, setReloadCity ] = useState(false)
    const dispatch = useDispatch()

    useEffect( ()=>{
        getActualStore()
        agenciesList.forEach(item => {
            item.loaded = false
        })
        // eslint-disable-next-line
      },[agenciesList])

    const getActualStore = async () => {
        const { repairFile } = store.getState().repairFile;
        if(repairFile){
            const { cities, zipCode, cityId } = store.getState().repairFile.repairFile;
            if(cities){
                setCities(cities)
            }
            if(zipCode){
                setZipcode(zipCode)
            }
            if(cityId){
                setSelectedCityId(cityId)
            }
        }
    }

    const handleSubmit = async () => {
        setIsLoading(true)
        let dept = zipcode.substring(0,2)
        await getRateZone(dept)
    }

    const handleZipCode = async (code) => {
        setReloadCity(true)
        setIsLoading(false)
        if(code){
            setZipcode(code)
            setSelectedCityId(0)
            dispatch(setRepairFile({zipCode: code}))
            dispatch(setRepairFile({cityId: 0}))
            await getCitiesFromZipCode(code, 0)
        }else{
            dispatch(setRepairFile({zipCode: ''}))
            dispatch(setRepairFile({cities: ''}))
            setZipcode('')
        }
    }

    const handleCity = (id) => {
        setReloadCity(true)
        setSelectedCityId(id)
        const city = cities[id] 
        if(city){
            dispatch(setRepairFile({cityId: city.id}))
            dispatch(setRepairFile({geoloc: city.geoloc}))
        }
    }

    const getCitiesFromZipCode = async (code, id) => {
            const apiUrl = 'https://geo.api.gouv.fr/communes?codePostal=';
            const format = '&format=geojson';
            let url = apiUrl + code + format;
            let nextId = 0
            setCities([])
            const zipCities = []
            await fetch( url )
            .then( async (response) => {
                await response.json()
                .then(json => {
                    json.features.forEach(city => {
                        zipCities.push({id: nextId++, name: city.properties.nom, geoloc: city.geometry.coordinates})
                    })
                    dispatch(setRepairFile({cities: zipCities}))
                })
                .then(()=> {
                    zipCities.forEach(city=>setCities(cities=>[...cities, city]))
                })
            })
    }

    const setRatezoneFromZipcode = (ratezone) => {
        let agency
        setIsLoading(false)
        setReloadCity(false)
        if(ratezone == 'outOfZone'){
            agency = agenciesList[0]
            dispatch(setRepairFile({nearestAgency: agency}))
            dispatch(setRepairFile({ratezone: ratezone}))
        }else{
            agency = agenciesList[ratezone.agence_id-1]
            dispatch(setRepairFile({nearestAgency: agency}))
            dispatch(setRepairFile({ratezone: ratezone.zone}))
        }
    }

    const getRateZone = async (dept) => {
        await fetch('/api/v1/ratezone/' + dept)
            .then( async response =>{
                await response.json()
                .then(json => {
                    if(json && json.length > 0){
                        json.forEach(ratezone => {
                            if(ratezone.zipcodes != null && ratezone.zipcodes != '' && ratezone.zipcodes != 'undefined'){
                                let zipcodes = JSON.parse("[" + ratezone.zipcodes.substring(1, ratezone.zipcodes.length-1) + "]");
                                zipcodes.forEach( ratezipcode => {
                                    if(ratezipcode == zipcode){
                                        setRatezoneFromZipcode(ratezone)
                                    }
                                })
                            }else{
                                setRatezoneFromZipcode(ratezone)
                            }
                        })
                    }else{
                        setRatezoneFromZipcode('outOfZone')
                    }
                })
            })
    }

    return (
        <div className="repairFileStep">
            <div className="repairFileStepHeader">
                <p style={{marginLeft: '4vw'}}>{props.header}</p>
            </div>
            <div className="formContainer" style={{marginRight: '6vw',marginTop: '4vh', alignItems: 'center'}}>
                    <label>Code Postal:</label>
                    <input 
                        value={zipcode}
                        type="text"
                        style={{width: '30vw', fontSize: '1em'}}
                        onChange={(e) => {handleZipCode(e.target.value)}}
                    />
                    <label style={{marginTop: '2vh'}}>Ville:</label>
                    <select className="citySelectRepairFile" value={selectedCityId} onChange={(e) => handleCity(e.target.value)}>
                        {!cities.length > 0 && <option value="1">Entrez un Code Postal</option>}
                        {/* {cities.length > 0 && <option value="nocity">Choisissez une commune</option>} */}
                        {cities.map((town)=>(
                                <option key={town.id} value={town.id}>{town.name}</option>
                            ))
                        }
                    </select>
                    {props.missingValues.length > 0 && props.missingValues.includes('zipcode') && !zipcode &&
                                <span className='warning'>Merci de choisir un code postal !</span>
                            }
                    <button 
                        className="citySelectRepairFile modalButton" 
                        style={ isLoading ? 
                        {marginTop: '2vh', backgroundColor: '#7cd8be'} : 
                        {marginTop: '2vh', backgroundColor: 'var(--primary)'}} 
                        disabled={isLoading} 
                        onClick={()=>handleSubmit()}>
                            { isLoading ?
                                <img src={Loading} style={{width: '24px', height: 'auto'}} alt="loading"/> :
                                <p style={{margin:'4px'}}>Valider</p>
                            }
                    </button>
                    {/* {nearestAgency && 
                        <span style={{marginTop: '2vh'}}>Agence la plus proche : {nearestAgency.name} à {nearestAgency.distance} kms</span>
                    } */}
                    <div className='nextStepBtnContainer'>
                        <button 
                            className="prevStepBtn prevStepBtnAdress modalButton" 
                            onClick={props.handlePrevClick}>
                                Précédent
                        </button>
                        <button 
                            className="nextStepBtn modalButton" 
                            style={ 
                                reloadCity ? 
                                {marginRight: '10vw', backgroundColor: '#7cd8be'} : 
                                {marginRight: '10vw', backgroundColor: 'var(--primary)'}} 
                            disabled={reloadCity} 
                            onClick={()=>props.handleNextClick()}>
                                Suivant
                        </button>
                    </div>                
            </div>
        </div>
    )
}

export default RepairFileLocation