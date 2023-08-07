import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux";
import { setPath } from "../features/pathSlice";
import { store } from '../store';
import RepairFileStepper from "../components/RepairFileStepper"
import RepairFileDevice from "./repairFileSteps/RepairFileDevice"
import RepairFileStatus from "./repairFileSteps/RepairFileStatus"
import RepairFileLocation from "./repairFileSteps/RepairFileLocation"
import RepairFileOffer from "./repairFileSteps/RepairFileOffer"
import RepairFileDatas from "./repairFileSteps/RepairFileDatas"
import RepairFileIntervention from "./repairFileSteps/RepairFileIntervention"
import RepairFilePayment from "./repairFileSteps/RepairFilePayment"
import LoginModal from "../components/LoginModal";


const RepairFile = () => {
    const { user } = useSelector((store) => store.user)
    // const { repairFile } = store.getState().repairFile;
    const dispatch = useDispatch()
    const [ indexStepper, setIndexStepper ] = useState(0)
    const [ missingValues, setMissingValues ] = useState([])
    const [ openModal, setOpenModal ] = useState(false)

    useEffect(()=>{
        const { indexStepper } = store.getState().path.path;
        if(indexStepper){
            setIndexStepper(indexStepper)
        }
        // eslint-disable-next-line
      },[])

    const getMissingValues = (requiredValues) => {
        let keys = []
        const { repairFile } = store.getState().repairFile;
        if(repairFile){
            Object.entries(repairFile).forEach(([key, val]) => {
                if(val !== "" && val !== null && val !== 'undefined'){
                    keys.push(key)
                }
            })
            return requiredValues.filter( key => !keys.includes(key));
        }else{
            return requiredValues
        }
    }

    const filterRequiredValues = () => {
        const { repairFile } = store.getState().repairFile;
        const requiredValues = steps[indexStepper].required
        // filtre les requiredValues pour laisser passer en Atelier sans les dates et horaires
        if(requiredValues){
            if(requiredValues.includes('phoneAppointment') 
                && repairFile.selectedOffer.intervention_type == 'Atelier' ||
                requiredValues.includes('selectedTimeSlotRef') 
                && repairFile.selectedOffer.intervention_type == 'Atelier'){
                    requiredValues.splice(requiredValues.indexOf('phoneAppointment'), 1)
                    requiredValues.splice(requiredValues.indexOf('selectedTimeSlotRef'), 1)
                    return requiredValues
            }else{
                return requiredValues
            }
        }
    }

    const handleNextClick = () => {
        const { repairFile } = store.getState().repairFile;
        const requiredValues = filterRequiredValues()
        if(requiredValues){
            const values = getMissingValues(requiredValues)
            if( values.length > 0 ){
                setMissingValues(values)
                return
            }
        }
        // force la connexion ou creation de compte à l'etape 3
        if(indexStepper < steps.length-1 && indexStepper != 3){
            setIndexStepper(indexStepper+1)
            dispatch(setPath({indexStepper:indexStepper+1}))
        }else if(indexStepper == 3){
            if(user){
                setIndexStepper(indexStepper+1)
                dispatch(setPath({indexStepper:indexStepper+1}))
            }else{
                setOpenModal(true)
            }
        }else if(indexStepper == 4){
            if(repairFile.selecteOffer.intervention_type == 'Atelier'){
                //[ 'issue', 'phoneAppointment', 'selectedTimeSlotRef' ]
                steps[4].required = [ 'issue' ]
                console.log(steps[indexStepper].required);
            }
        }else{
            console.log('ok');
            // a remplacer par 'Terminer' dans btn, persistance dossier...
            setIndexStepper(0)
            dispatch(setPath({indexStepper:0}))
        }
    }

    const handlePrevClick = () => {
        if(indexStepper > 0){
            setIndexStepper(indexStepper-1)
            dispatch(setPath({indexStepper:indexStepper-1}))
        }else{
            // a remplacer par 'Terminer' dans btn, persistance dossier...
            setIndexStepper(steps.length-1)
            dispatch(setPath({indexStepper:steps.length-1}))
        }
    }

    const handleCloseModal = () => {
        setOpenModal(false)
    }

    const steps = 
        [
            {
                screen : <RepairFileStatus header = {'Je suis un client...'} handleNextClick = {handleNextClick}/>
            },
            {
                screen : <RepairFileDevice header = {'J\'ai un appareil...'} handlePrevClick = {handlePrevClick} handleNextClick = {handleNextClick} missingValues = {missingValues}/>,
                required: [ 'device', 'brand' ]
            },
            {
                screen : <RepairFileLocation header = {'J\'habite...'} handlePrevClick = {handlePrevClick} handleNextClick = {handleNextClick} missingValues = {missingValues}/>,
                required: [ 'zipCode', 'cityId', 'ratezone' ]
            },
            {
                screen : <RepairFileOffer header = {'Choisissez votre prestation...'} handlePrevClick = {handlePrevClick} handleNextClick = {handleNextClick} missingValues = {missingValues}/>,
                required: [ 'selectedRef', 'selectedOffer' ]
            },
            {
                screen : <RepairFileDatas header = {'Quelques précisions...'} handlePrevClick = {handlePrevClick} handleNextClick = {handleNextClick} missingValues = {missingValues}/>,
                required: [ 'issue', 'phoneAppointment', 'selectedTimeSlotRef' ]
            },
            {
                screen : <RepairFileIntervention header = {'Récapitulons...'} handlePrevClick = {handlePrevClick} handleNextClick = {handleNextClick} missingValues = {missingValues}/>,
                required: [ 'acceptCGV' ]
            },
            {
                screen : <RepairFilePayment header = {'Règlement'} handlePrevClick = {handlePrevClick}/>
            }
        ]

    return (

        <div className="repairFile">
            <RepairFileStepper activeStep={indexStepper}/>
            {steps[indexStepper].screen}
            <LoginModal open={openModal} handleCloseModal={handleCloseModal}/>
            {/* <RepairFileDevice/> */}
        </div>
    )
}

export default RepairFile