import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { setRepairFile } from "../../features/repairFile/repairFileSlice"
import { store } from "../../store"
import Loading from '../../assets/images/loading.gif'


const RepairFileAdress = (props) => {
    const { agencies } = useSelector((store) => store.agencies)
    const agenciesList = JSON.parse(JSON.stringify(agencies));
    const [zipcode, setZipcode] = useState('')
    const [cities, setCities] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [selectedCityId, setSelectedCityId] = useState(0)
    const [nearestAgency, setNearestAgency] = useState()
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
            const { cities, zipCode, cityId, nearestAgency } = store.getState().repairFile.repairFile;
            if(cities){
                setCities(cities)
            }
            if(zipCode){
                setZipcode(zipCode)
            }
            if(cityId){
                setSelectedCityId(cityId)
            }
            if(nearestAgency){
                setNearestAgency(nearestAgency)
            }
        }
    }

    const handleSubmit = async () => {
        setIsLoading(true)
        await getDistancesToAgencies()
    }

    const handleZipCode = async (code) => {
        setReloadCity(true)
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

    // + chenillard 'loading'
    const getNearestAgency = () => {
        agenciesList.forEach(item => {
            item.distance = Math.round(item.distance)
        })
        let min = Math.min(...agenciesList.map(item => item.distance))
        let result = agenciesList.filter(item => item.distance === min)
        // eslint-disable-next-line
        if(result[0] != 'undefined' && result[0] != null && result[0] != ''){
            dispatch(setRepairFile({nearestAgency: result[0]}))
            setNearestAgency(result[0])
            setIsLoading(false)
            setReloadCity(false)
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
                    // setIsLoading(true)
                })
            })
    }

    const getDistancesToAgencies = async () => {
        const { cityId } = store.getState().repairFile.repairFile;
        const city = cities[cityId]
        let cityGeoLoc = JSON.stringify(city.geoloc)
        cityGeoLoc = cityGeoLoc.substring(1, cityGeoLoc.length-1)

        const ignAPIUrl = 'https://wxs.ign.fr/calcul/geoportail/itineraire/rest/1.0.0/route?'
        const resource = '&resource=bdtopo-osrm';
        const start = '&start=' + cityGeoLoc
        const profile = '&profile=car';

        agenciesList.forEach( async (agence) => {
            let agenceGeoloc = JSON.stringify(agence.geoloc)
            agenceGeoloc = agenceGeoloc.substring(1, agenceGeoloc.length-1)
            let end = '&end=' + agenceGeoloc
            let url = ignAPIUrl + resource + start + end + profile

            await fetch( url )
            .then( async (response) => {
                    await response.json()
                    .then(
                            json => {
                                agence.distance = Math.round(json.distance/1000)
                                agence.loaded = true
                            }
                        ).then(()=> {
                            let fullLoaded = agenciesList.some(function(element) {
                                return element.loaded;
                            });
                            if(fullLoaded){
                                getNearestAgency()
                            }
                        })
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
                    {nearestAgency && 
                        <span style={{marginTop: '2vh'}}>Agence la plus proche : {nearestAgency.name} à {nearestAgency.distance} kms</span>
                    }
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

export default RepairFileAdress