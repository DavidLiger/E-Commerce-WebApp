import { useState, useEffect, useRef } from "react"
import { useDispatch, useSelector } from "react-redux"
import { setRepairFile } from '../../features/repairFileSlice';
import { store } from '../../store';
import AgencyInfos from "../../components/AgencyInfos";

const RepairFileOffer = (props) => {
    const { repairFile } = useSelector((store) => store.repairFile)
    const [ interventionType, setInterventionType ] = useState('')
    const [ offerAnnounce, setOfferAnnounce ] = useState('')
    const [ offer, setOffer] = useState('')
    const [ remoteDiag, setRemoteDiag ] = useState('')
    const [ price, setPrice ] = useState('')
    const [ displayPrice, setDisplayPrice ] = useState('')
    const [ remoteDiagPrice, setRemoteDiagPrice] = useState('')
    const [ selectedRef, setSelectedRef ] = useState('')
    const dispatch = useDispatch()
    const suitableOfferRef = useRef(0)
    const remoteOfferRef = useRef(0)

    useEffect( ()=> {
        if(repairFile){
            const { selectedRef } = store.getState().repairFile.repairFile;
            if(selectedRef){
                if(selectedRef == 'suitableOfferRef'){
                    setSelectedRef(suitableOfferRef)
                }else{
                    setSelectedRef(remoteOfferRef)
                }
            }
        }
        async function fetchDataForCategory() {
            const {id} = repairFile.device
            await fetch('/api/v1/rates',{
                method: 'POST',
                body: JSON.stringify({"id":id}),
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then( async response =>{
                const json = await response.json()
                if(response.ok){
                    console.log(json);
                    setOffer(json)
                    setOfferDisplay(json)
                }else{
                    console.log(json.error);
                }
            })
        }
        fetchDataForCategory()
        async function fetchDataForRemote() {
            await fetch('/api/v1/rates/remote')
            .then( async response =>{
                const json = await response.json()
                if(response.ok){
                    setRemoteDiag(json)
                    setRemoteDiagPrice(json.support)
                }else{
                    console.log(json.error);
                }
            })
        }
        fetchDataForRemote()
        // eslint-disable-next-line
    }, [repairFile])

    const setOfferDisplay = json => {
        const movingRate = getMovingRate(json)
        setInterventionType(json.intervention_type)
        const adverb = json.intervention_type == 'Domicile' ? ' à ': ' en '
        setOfferAnnounce('Intervention ' + adverb + json.intervention_type)
        setPrice(movingRate + json.support)
        setDisplayPrice('À partir de ' + (movingRate + json.support)+ ' €')
    }

    const getMovingRate = json => {
        let movingRate = 0
        const zone = repairFile.ratezone
        switch(true){
            case(zone == 'Z1'):
                movingRate = json.short_moving
                break;
            case(zone == 'Z2'):
                movingRate = json.middle_moving
                break;
            case(zone == 'Z3'):
                movingRate = json.long_moving
                break;
            default:
                movingRate = json.short_moving
        }
        return movingRate
    }

    const handleOfferClicked = ref => {
        setSelectedRef(ref)
        if(ref == suitableOfferRef){
            dispatch(setRepairFile({selectedOffer: offer}))
            dispatch(setRepairFile({selectedRef: 'suitableOfferRef'}))
            dispatch(setRepairFile({price: price}))
        }else{
            dispatch(setRepairFile({selectedOffer: remoteDiag}))
            dispatch(setRepairFile({selectedRef: 'remoteOfferRef'}))
            dispatch(setRepairFile({price: remoteDiagPrice}))
        }
        
    }

    return (
        <div className="repairFileStep">
            <div className="repairFileStepHeader">
                <p style={{marginLeft: '4vw'}}>{props.header}</p>
            </div>
            <div className="repairFileOfferContainer">
                {repairFile.ratezone != 'outOfZone' &&
                    <div 
                        name="suitableOffer" 
                        ref={suitableOfferRef} 
                        className={
                            `offerDiv ${suitableOfferRef == selectedRef ? 
                            "offerSelected" :
                            "offerUnselected"}`
                        } 
                        onClick={() => handleOfferClicked(suitableOfferRef)}>
                        <h2>{offerAnnounce}</h2>
                        <span style={{fontSize:'1.6em'}}>{displayPrice}</span>
                    </div>
                }
                <div 
                    name="remoteOffer" 
                    ref={remoteOfferRef} 
                    className={
                        `offerDiv ${remoteOfferRef == selectedRef ? 
                        "remoteOfferSelected" :
                        "remoteOfferUnselected"}`
                    } 
                    onClick={() => handleOfferClicked(remoteOfferRef)}>
                    <h4>Diagnostic à distance</h4>
                    <span style={{fontSize:'1.2em'}}>{remoteDiagPrice} €</span>
                    <span style={{fontSize:'0.8em', marginTop:'2vh'}}>Appel audio/vidéo avec un expert 909</span>
                </div>
            </div>
            {props.missingValues.length > 0 && props.missingValues.includes('selectedOffer') && !selectedRef &&
                <span className='warning center' style={{marginTop:'2vh', fontSize:'1em'}}>Merci de choisir une offre</span>
            }
            {interventionType === 'Atelier' && repairFile.ratezone != 'outOfZone' &&
                <div 
                className="center workShopInterTypeContainer">
                    <span>Déposez directement votre appareil dans l'agence 909 la plus proche :</span>
                    <div style={{width:'100%', marginTop:'2vh'}}>
                        <AgencyInfos agency={repairFile.nearestAgency} />
                    </div>
                    <span style={{marginTop:'2vh'}}>Une fois le diagnostic établi et si une réparation 
                        plus avancée est nécessaire, un devis vous sera envoyé pour accord.</span>
                    <span style={{marginTop:'2vh'}}>909 vous informera par SMS dès que vôtre appareil sera prêt !</span>
                </div>
            }
            <div className="nextStepBtnContainer">
                <button className="prevStepBtn modalButton" onClick={props.handlePrevClick}>Précédent</button>
                <button className="nextStepBtn modalButton" onClick={props.handleNextClick}>Suivant</button>
            </div>
        </div>
    )
}

export default RepairFileOffer