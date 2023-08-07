import { useDispatch, useSelector } from "react-redux"
import FileModal from "../../components/FileModal"
import { useState } from "react"
import { useEffect } from "react"
import { setRepairFileSelected } from "../../features/repairFileSlice"

const AdminFiles = () => {
    const { repairFiles } = useSelector((store) => store.repairFile)
    const { repairFileSelected } = useSelector((store) => store.repairFile)
    const [ files, setFiles] = useState()
    const dispatch = useDispatch()

    useEffect(() => {
        setFiles(repairFiles)
        if(files){
            if(repairFileSelected){
                const newList = files.map((item) => { 
                    if (item.id === repairFileSelected) {
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
        }
        // eslint-disable-next-line
    }, [repairFiles])

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

    return(
        <div className="adminContainer">
            {files && files.map((file, index)=>(
                <div 
                    key={index} 
                    onClick={()=>{handleFileClicked(file)}}>
                        <FileModal
                            selected={file.selected}
                            id={file.id}
                            firstName={file.first_name} 
                            lastName={file.last_name}
                            phoneAppointment={setPhoneAppointment(file.phone_appointment)}/>
                </div>
                ))
            }
        </div>
    )
}

export default AdminFiles