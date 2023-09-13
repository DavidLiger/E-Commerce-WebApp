import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setRepairFile } from '../../features/repairFileSlice';
import AdviceModal from '../../components/AdviceModal';
import { store } from '../../store';

import QuestionMarkIcon from '../../assets/images/question_mark_icon.png'
import UploadAndDisplayImage from "../../hooks/uploadAndDisplayImage";
import Textarea from '@mui/joy/Textarea';

import Calendar from "react-calendar"
import 'react-calendar/dist/Calendar.css';
import { FormControl, FormHelperText } from "@mui/joy";

const RepairFileDatas = (props) => {
    const { user } = useSelector((store) => store.user)
    const otherAdvice = { 
        id: 999, 
        device_id: 999, 
        issue: 'J\'ai un autre problème', 
        solution: 'Merci de préciser votre panne dans le commentaire'
    }
    const { repairFile } = useSelector((store) => store.repairFile)
    const [ advices, setAdvices ] = useState([])
    const [ serialNumber, setSerialNumber ] = useState('')
    const [ articleCode, setArticleCode ] = useState('')
    const [ comment, setComment ] = useState('')
    const [ issue, setIssue ] = useState('')
    const [ showSNAdvice, setShowSNAdvice ] = useState(false)
    const [ showCAAdvice, setShowCAAdvice ] = useState(false)
    const [ adverb, setAdverb ] = useState()
    const [ adviceModalHeader, setAdviceModalHeader] = useState('')
    const { device } = repairFile
    const dispatch = useDispatch()
    const [ phoneAppointment, setPhoneAppointment] = useState('')
    const { intervention_type } = repairFile.selectedOffer
    const [ selectedTimeSlotRef, setSelectedTimeSlotRef ] = useState()
    const morningRef = useRef(0)
    const afternoonRef = useRef(0)
    const [ holidays, setHolidays ] = useState([])
    const [ year ,setYear ] = useState(new Date().toLocaleString('fr-FR').split(' ')[0].split('/')[2])
    const [ dayPlanning, setDayPlanning ] = useState([
        {id:1, hour: 9}, 
        {id:2, hour: 10}, 
        {id:3, hour: 11}, 
        {id:4, hour: 12}, 
        {id:5, hour: 14}, 
        {id:6, hour: 15}, 
        {id:7, hour: 16}, 
        {id:8, hour: 17}])

    useEffect( ()=> {
        async function fetchData() {
            await fetch('/api/v1/advices/' + device.id)
            .then( async response =>{
                await response.json()
                .then(json => {
                    if(json){
                        let advicesJson = []
                        json.forEach(advice => {
                            advicesJson.push(advice)
                        })
                        advicesJson.push(otherAdvice)
                        setAdvices(advicesJson)
                        dispatch(setRepairFile({advices: advicesJson}))
                    }
                })
            })
        }
        // renouvellement du useEffect conditionné à year dans tableau parametre
        // year remis à jour quand clique sur calendrier (voir tileDisabled)
        async function fetchHolidays() {
            const url = `https://calendrier.api.gouv.fr/jours-feries/metropole/${year}.json`;
            await fetch( url )
            .then(async response =>{
                await response.json()
                .then( async json => {
                    Object.keys(json).map((key, index) => {
                        let holiday = key
                        holiday = holiday.split('-')
                        let holiDate = `${holiday[2]}/${holiday[1]}/${holiday[0]}`
                        setHolidays( holidays => [...holidays, holiDate])
                    })
                })
            })
        }
        const { articleCode, serialNumber, comment, issue, advices, selectedTimeSlotRef, phoneAppointment, dayPlanning, selectedOffer } = store.getState().repairFile.repairFile;
        if(articleCode){
            setArticleCode(articleCode)
        }
        if(serialNumber){
            setSerialNumber(serialNumber)
        }
        if(comment){
            setComment(comment)
        }
        if(advices){
            if(issue){
                setIssue(issue)
                const newList = []
                advices.map((item) => { 
                    if (item.id === issue.id) {
                        const updatedItem = {...item, selected: true}
                        newList.push(updatedItem)
                    }
                    else{
                        const updatedItem = {...item, selected: false}
                        newList.push(updatedItem)
                    }
                });
                setAdvices(newList)
            }else{
                setAdvices(advices)
            }
        }else{
            fetchData()
        }
        if(selectedOffer.intervention_type == 'Atelier'){
            dispatch(setRepairFile({phoneAppointment: ''}))
            dispatch(setRepairFile({selectedTimeSlotRef: ''}))
        }
        if(phoneAppointment){
            let dateFromString = phoneAppointment.split('/')
            setPhoneAppointment(new Date(dateFromString[2],dateFromString[1]-1,dateFromString[0]))
        }
        if(dayPlanning){
            setDayPlanning(dayPlanning)
        }
        if(!dayPlanning){
            let planning = [{id:1, hour: 9},{id:2, hour: 10},{id:3, hour: 11}, 
                {id:4, hour: 12},{id:5, hour: 14},{id:6, hour: 15},{id:7, hour: 16}, 
                {id:8, hour: 17}]
            setDayPlanning(planning)
        }
        if(selectedTimeSlotRef){
            setSelectedTimeSlotRef(selectedTimeSlotRef)
            const newList = []
            dayPlanning.map((item) => { 
                if (item.id === selectedTimeSlotRef.id) {
                    const updatedItem = {...item, selected: true}
                    newList.push(updatedItem)
                }
                else{
                    const updatedItem = {...item, selected: false}
                    newList.push(updatedItem)
                }
            });
            setDayPlanning(newList)
        }else{
                let planning = [{id:1, hour: 9},{id:2, hour: 10},{id:3, hour: 11}, 
                {id:4, hour: 12},{id:5, hour: 14},{id:6, hour: 15},{id:7, hour: 16}, 
                {id:8, hour: 17}]
            setDayPlanning(planning)
        }
        chooseAdverb()
        fetchHolidays()
        // eslint-disable-next-line
    }, [year])

    const handleIssueClicked = (item) => {
        if(item.id == 999){
            setAdviceModalHeader('Afin de mieux vous répondre...')
        }else{
            setAdviceModalHeader('Avant de continuer, avez-vous vérifié... ?')
        }
        setIssue({id:item.id, device_id:item.device_id, issue:item.issue, solution:item.solution})
        dispatch(setRepairFile({issue: issue}))
        setAdvices(setSelectedIcon(advices, item.id))
    }

    const handleDayPlanningClicked = (item) => {
        setSelectedTimeSlotRef(item)
        dispatch(setRepairFile({selectedTimeSlotRef: item}))
        setDayPlanning(setSelectedIcon(dayPlanning, item.id))
    }

    const setSelectedIcon = (list, id) => {
        const newList = list.map((item) => { 
            if (item.id === id) {
                const updatedItem = {...item, selected: true}
                return updatedItem;
            }
            else{
                const updatedItem = {...item, selected: false}
                return updatedItem;
            }
        });
        return newList
    }

    const handleArticleCode = articleCode => {
        if(articleCode){
            setArticleCode(articleCode)
            dispatch(setRepairFile({articleCode: articleCode}))
        }else{
            setArticleCode('')
            dispatch(setRepairFile({serialNumber: ''}))
        }
    }

    const handleSerialNumber = serialNumber => {
        if(serialNumber){
            setSerialNumber(serialNumber)
            dispatch(setRepairFile({serialNumber: serialNumber}))
        }else{
            setSerialNumber('')
            dispatch(setRepairFile({serialNumber: ''}))
        }
    }

    const toggleSNAdvice = () => {
        let toggle = !showSNAdvice
        setShowSNAdvice(toggle)
    }

    const toggleCAAdvice = () => {
        let toggle = !showCAAdvice
        setShowCAAdvice(toggle)
    }

    const chooseAdverb = () => {
        const under = [1, 2, 8]//sous
        const behind = [3, 6, 7, 9, 11, 12, 13]//derrière
        const inNote = [4, 5, 10]//dans la notice
        if(under.includes(device.id)){
            setAdverb('sous votre')
        }
        if(behind.includes(device.id)){
            setAdverb('derrière votre')
        }
        if(inNote.includes(device.id)){
            setAdverb('dans la notice de votre')
        }
    }

    const handleComment = comment => {
        if(comment){
            setComment(comment)
            dispatch(setRepairFile({comment: comment}))
        }else{
            setComment('')
            dispatch(setRepairFile({comment: ''}))
        }
    }

    const handleAppointment = async (e) => {
        let date = e.toLocaleDateString()
        setPhoneAppointment(e)
        dispatch(setRepairFile({phoneAppointment: date}))
        // update planning proposé
        // setDayPlanning selon ce qui est enregistré
        
        await fetch('/api/v1/remoteDiagPlanning',{
            method: 'POST',
            body: JSON.stringify({date: date}),
            headers: {
                'Content-Type': 'application/json',
                'Authorization':`Bearer ${user.token}`
            }
        })
        .then( async response =>{
            await response.json()
            .then(async json => {
                if(json.length > 0){
                    let slots = []
                    json.forEach(slot => {
                        slots.push(Number(slot.time_slot))
                    })
                    if(dayPlanning){
                        var result = dayPlanning.filter( x => !slots.includes(x.hour));
                        if(selectedTimeSlotRef){
                            setDayPlanning(setSelectedIcon(result, selectedTimeSlotRef.id))
                        }else{
                            setDayPlanning(result)
                        }
                        dispatch(setRepairFile({dayPlanning: result}))
                    }
                }else{
                    let planning = [{id:1, hour: 9},{id:2, hour: 10},{id:3, hour: 11}, 
                        {id:4, hour: 12},{id:5, hour: 14},{id:6, hour: 15},{id:7, hour: 16}, 
                        {id:8, hour: 17}]
                    // setDayPlanning(planning)
                    if(selectedTimeSlotRef){
                        setDayPlanning(setSelectedIcon(planning, selectedTimeSlotRef.id))
                    }else{
                        setDayPlanning(planning)
                    }
                    dispatch(setRepairFile({dayPlanning: planning}))
                }
            })
        })
    }

    const handleTimeSlotClicked = ref => {
        setSelectedTimeSlotRef(ref)
        if(ref == morningRef){
            dispatch(setRepairFile({selectedTimeSlotRef: 'morning'}))
        }else{
            dispatch(setRepairFile({selectedTimeSlotRef: 'afternoon'}))
        }
        
    }

    const tileDisabled = ({ date }) => {
        setYear(date.toLocaleString('fr-FR').split(' ')[0].split('/')[2])
        if(date < new Date() || date.getDay() == 0 || date.getDay() == 6 || holidays.includes(date.toLocaleString('fr-FR').split(' ')[0])){
            return true
        }
     }

    return (
        <div className="repairFileStep">
            <div className="repairFileStepHeader">
                <p style={{marginLeft: '4vw'}}>{props.header}</p>
            </div>
            <div className='adviceContainer'>
            {intervention_type && (intervention_type == 'Domicile' || intervention_type == 'remote') &&
                <div className="overviewDiv">
                    <label style={{fontSize:'1.4em', color:'#3f2564'}}>
                        Vous avez choisi { intervention_type == 'Domicile' ?
                            <span>l'intervention à Domicile</span> :
                            <span>le diagnostic à distance</span>
                        } :
                    </label>
                    <span className="datasText">
                    &emsp; Pour réaliser cette prestation, un technicien 909 va vous contacter
                        { intervention_type == 'Domicile' ?
                            <span> pour confirmer le
                            diagnostic et convenir avec vous d’un RDV pour l’intervention à votre domicile. <br/>
                            Pour cet appel, choisissez ci-dessous le créneau qui vous convient le mieux.</span> :
                            <span>.</span>
                        }
                        <br/><br/>&emsp;(Avec votre accord, le technicien pourra vous demander d’activer la visio afin de vous aidez au mieux à
                        établir le bon diagnostic)
                        <br/><br/><p style={{textDecoration:'underline'}}>A savoir : </p>&emsp;Si lors de cet appel vous être devant votre appareil ce n’est que mieux, sinon veillez à compléter de façon
                        complète et précise les informations suivantes
                    </span>
                    <div className="calendarPlanningContainer">
                        <div className="calendarContainer">
                            <Calendar
                            // faire un handle RDVDate qui setState & dispatche dans Redux
                                onChange={handleAppointment}
                                value={phoneAppointment}
                                tileDisabled={tileDisabled}
                                dateFormat="d MMM yyyy"
                            />
                        </div>
                        <div className="dayPlanningContainer">
                        { phoneAppointment && dayPlanning && dayPlanning.map((item, index)=>(
                            dayPlanning[index].hour != 17 &&
                                <div 
                                    key={index} 
                                    className='dayPlanningDiv' 
                                    style={ 
                                        item.selected ? 
                                        {backgroundColor: '#7c5baa', color: '#fff'} : 
                                        {backgroundColor: '#fff'}} 
                                    onClick={()=>{handleDayPlanningClicked(item)}}
                                >{
                                    dayPlanning[index].hour != 12 ?
                                    <span>{dayPlanning[index].hour} h - {Number(dayPlanning[index].hour) + 1} h</span> :
                                    <span>{dayPlanning[index].hour} h - {14} h</span>
                                }
                                    
                                </div>
                            ))
                        }
                        </div>
                    </div>
                </div>
            }
            <div style={{width:'80%', marginLeft:'10%', marginBottom:'2vh'}}>
            {props.missingValues.length > 0 && props.missingValues.includes('phoneAppointment') && !phoneAppointment && intervention_type != 'Atelier' &&
                    <span className='warning center' style={{marginTop: '1vh', fontSize: '1em'}}>Merci de choisir une date</span>
                }
            {props.missingValues.length > 0 && props.missingValues.includes('selectedTimeSlotRef') && !selectedTimeSlotRef && intervention_type != 'Atelier' &&
                    <span className='warning center' style={{marginTop: '1vh', fontSize: '1em'}}>Merci de choisir un créneau horaire</span>
                }
            </div>
            <div className="adviceBtnsContainer">
            {advices && advices.map((item, index)=>(
                        <div 
                            key={index} 
                            className='adviceDiv' 
                            style={ 
                                item.selected ? 
                                {backgroundColor: '#b5f3ca'} : 
                                {backgroundColor: 'rgba(255,255,255,0)'}} 
                            onClick={()=>{handleIssueClicked(item)}}
                        >
                            <AdviceModal 
                                header={adviceModalHeader}
                                title={item.issue} 
                                advice={item.solution}/>
                        </div>
                    ))
                }
            </div>
            </div>
            {props.missingValues.length > 0 && props.missingValues.includes('issue') && !issue &&
                    <span className='warning center' style={{marginTop: '2vh', fontSize: '1em'}}>Merci de choisir une panne</span>
                }
            {/* <div className="articleCode">
                <label>Code de l'article</label>
                <div style={{display:'flex', flexDirection:'row', alignItems:'center'}}>
                    <input
                        type="text" 
                        value={articleCode}
                        placeholder='ex : UE43AU8005' 
                        onChange={(e) => {handleArticleCode(e.target.value)}}
                    />
                    <img 
                        className="questionMarkBtn"
                        src={QuestionMarkIcon}
                        alt="YT"
                        onClick={()=>{toggleCAAdvice()}}
                    />
                </div>
                {showCAAdvice &&
                    <span style={{fontSize: '0.8em', fontStyle:'italic'}}>Vous pouvez trouver ce numéro sur la notice ou la boite de votre appareil</span>
                }
            </div>
            {props.missingValues.length > 0 && props.missingValues.includes('articleCode') && !articleCode &&
                    <span className='warning center' style={{marginTop: '2vh', fontSize: '1em'}}>Merci de saisir le code de l'article</span>
                } */}
            <div className="serialNumber">
                <label>Numéro de série</label>
                <div style={{display:'flex', flexDirection:'row', alignItems:'center'}}>
                    <input
                        type="text" 
                        value={serialNumber}
                        placeholder='ex : 111111112223dddsd224' 
                        onChange={(e) => {handleSerialNumber(e.target.value)}}
                    />
                    <img 
                        className="questionMarkBtn"
                        src={QuestionMarkIcon}
                        alt="YT"
                        onClick={()=>{toggleSNAdvice()}}
                    />
                </div>
                {showSNAdvice &&
                    <span style={{fontSize: '0.8em', fontStyle:'italic'}}>Vous pouvez trouver ce numéro {adverb} {device.name}</span>
                }
            </div>
            <UploadAndDisplayImage/>
            <FormControl style={{width:'50%', marginLeft:'25%', marginTop:'3%'}}>
                <label style={{marginBottom:'1vh'}}>Commentaire</label>
                <Textarea 
                    placeholder="Passez-moi un coup de fil avant d'arriver..." 
                    value={comment}
                    onChange={(e) => {handleComment(e.target.value)}}
                    minRows={2} />
                <FormHelperText>Si vous avez quelques précisions à nous apporter...</FormHelperText>
            </FormControl>
            <div className='nextStepBtnContainer'>
                <button className="prevStepBtn modalButton" onClick={props.handlePrevClick}>Précédent</button>
                <button className="nextStepBtn modalButton" onClick={props.handleNextClick}>Suivant</button>
            </div>
        </div>
    )
}

export default RepairFileDatas