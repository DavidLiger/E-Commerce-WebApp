import { useDispatch, useSelector } from "react-redux"
import FileModal from "../../components/FileModal"
import { useState } from "react"
import { useEffect } from "react"
import { setRepairFileSelected } from "../../features/repairFileSlice"
import Calendar from "react-calendar"

const AdminFiles = () => {
    const { user } = useSelector((store) => store.user)
    const { repairFiles } = useSelector((store) => store.repairFile)
    const { repairFileSelected } = useSelector((store) => store.repairFile)
    const [ files, setFiles] = useState([])
    const [ year ,setYear ] = useState(new Date().toLocaleString('fr-FR').split(' ')[0].split('/')[2])
    const [ month ,setMonth ] = useState(new Date().toLocaleString('fr-FR').split(' ')[0].split('/')[1])
    const [ holidays, setHolidays ] = useState([])
    const [ phoneDatesDays, setPhoneDatesDays ] = useState([])
    const dispatch = useDispatch()

    useEffect(() => {
        async function fetchPhoneDates() {
            await fetch('/api/v1/remoteDiagPlanning/' + month + '/' + year,{
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization':`Bearer ${user.token}`
                }
            })
            .then(async response =>{
                await response.json()
                .then( async json => {
                    setPhoneDatesDays([])
                    json.forEach(element => {
                        setPhoneDatesDays( phoneDatesDays => [...phoneDatesDays, element.phone_appointment])
                    });
                })
            })
        }
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
        fetchPhoneDates()
        fetchHolidays()
        // eslint-disable-next-line
    }, [repairFiles, month, year])

    const handleFileClicked = (file) => {
        dispatch(setRepairFileSelected(file.id))
        setSelectedFile(file.id)
    }

    const setSelectedFile = (id) => {
        const newList = files.map((item) => { 
            if (item.id === id) {
                const updatedItem = {...item, selected: true}
                return updatedItem;
            }
            else{
                const updatedItem = {...item, selected: false}
                return updatedItem;
            }
        });
        setFiles(newList);
    }

    const setPhoneAppointment = (appointment) => {
        const date = new Date();
        let day = date.getDate();
        let month = date.getMonth() + 1;
        let year = date.getFullYear();
        const date1 = new Date(`${month}/${day}/${year}`)
        const rdvDate = appointment.split('/')
        const date2 = new Date(`${rdvDate[1]}/${rdvDate[0]}/${rdvDate[2]}`);
        const isPast = date2 < date1
        if(isPast){
            return ['','']
        }else{
            const diffTime = Math.abs(date2 - date1);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
            if(diffDays > 3){
                return [appointment, '#72f692']
            }
            if(diffDays < 3 && diffDays > 0){
                return [appointment, '#f6ab72']
            }
            if(diffDays == 0){
                return [appointment, '#f67272']
            }
        }

    }

    // instead of setDayPlanning -> setList des diag à distance
    const handleAppointment = async (e) => {
        let date = e.toLocaleDateString()
        setFiles([])
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
                    json.forEach(async file => {
                        await fetch('/api/v1/phoneDateFile/' + file.id,{
                            method: 'GET',
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization':`Bearer ${user.token}`
                            }
                        })
                        .then(async fileResponse => {
                            await fileResponse.json()
                            .then( async fileJson => {
                                setFiles(files => [...files, fileJson[0]])
                            })
                        })
                    })
                }
            })
        })
    }

    const tileDisabled = ({ date }) => {
        let middleDay = date.toLocaleString('fr-FR').split(' ')[0].split('/')[0]
        if(middleDay == 15){
            setYear(date.toLocaleString('fr-FR').split(' ')[0].split('/')[2])
            setMonth(date.toLocaleString('fr-FR').split(' ')[0].split('/')[1])
        }
        let todayDate = new Date();
        todayDate.setDate(todayDate.getDate() - 1);
        if(date < todayDate || 
            date.getDay() == 0 || 
            date.getDay() == 6 || 
            holidays.includes(date.toLocaleString('fr-FR').split(' ')[0])
            ){
            return true
        }
     }

    return(
        <div className="adminContainer">
            <div style={{width:'50%', height:'50%', marginLeft:'3%', display:'flex', alignItems:'center', justifyContent:'center'}}>
                <Calendar
                    // faire un handle RDVDate qui setState & dispatche dans Redux
                    onChange={handleAppointment}
                    value={new Date()}
                    tileDisabled={tileDisabled}
                    dateFormat="d MMM yyyy"
                    tileClassName={({ date, view }) => {
                        if(phoneDatesDays.includes(date.toLocaleString('fr-FR').split(' ')[0])){
                         return  'adminDatesTile'
                        }
                      }}
                />
            </div>
            <div style={{marginTop: '3vh', height:'50%', overflow: 'scroll'}}>
                {files && files.map((file, index)=>(
                    <div 
                        key={index} 
                        onClick={()=>{handleFileClicked(file)}}>
                            <FileModal
                                selected={file.selected}
                                id={file.id}
                                firstName={file.first_name} 
                                lastName={file.last_name}
                                phoneAppointment={setPhoneAppointment(file.phone_appointment)}
                                />
                    </div>
                    ))
                }
            </div>
        </div>
    )
}

export default AdminFiles