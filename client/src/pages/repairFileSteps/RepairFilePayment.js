import { useState } from "react"
import { useSelector } from "react-redux"

const RepairFilePayment = (props) => {

    const { repairFile } = useSelector((store) => store.repairFile)
    const { user } = useSelector((store) => store.user)
    const [ paymentIFrame, setPaymentIFrame ] = useState('')

    const handleSubmit = async (e) => {
        e.preventDefault()
        let email = user.user.email
        // remettre toute la partie persistance photo suite à la 
        // persistance du dossier 
        // + partie get dans fileModal
        // + suppression des photos dans BDD (delete) si suppression dossier ou
        // suppression photo par l'utilisateur

        await fetch('/api/v1/upToPayment',{
                method: 'POST',
                body: JSON.stringify({email: email, price: repairFile.price}),
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization':`Bearer ${user.token}`
                }
        }).then(async response =>{
            await response.json()
            .then(async json =>{
                console.log(json);
                setPaymentIFrame(json.result)
            })
        })

        //Enchainement des actions suite au paiement
        await fetch('/api/v1/repairfile',{
            method: 'POST',
            body: JSON.stringify(repairFile),
            headers: {
                'Content-Type': 'application/json',
                'Authorization':`Bearer ${user.token}`
            }
        })
        .then(async response =>{
            await response.json()
            .then(async json => {
                if(json.success){
                    console.log(json);
                    const id = json.id
                    if(json.photo_files){
                        let photoFiles = json.photo_files.split(',')
                        if(typeof photoFiles !== 'undefined' && photoFiles.length > 0){
                            photoFiles.map(async (photoFile) => {
                                await fetch('/api/v1/manageImg',{
                                    method: 'POST',
                                    body: JSON.stringify({photoFile: photoFile, id: id}),
                                    headers: {
                                        'Content-Type': 'application/json',
                                        'Authorization':`Bearer ${user.token}`
                                    }
                                })//
                            })
                        }
                    }
                    await fetch('/api/v1/transferFile',{
                        method: 'POST',
                        body: JSON.stringify(json),
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization':`Bearer ${user.token}`
                        }
                    })
                    .then( async response => {
                        // si succès récupère l'id de bo et avec l'id local fait un update 
                        // (ajoute erp_file_id) sur la ligne du dossier
                        await response.json()
                        .then( async json => {
                            console.log(json);
                            const result = JSON.parse(json.resultToJson)
                            if(result){
                                const erp_file_id = result.message.body.createDossierResponse.dossier.reference 
                                if(erp_file_id){
                                    const file = await fetch('/api/v1/updateFile',{
                                        method: 'POST',
                                        body: JSON.stringify({id: id, erp_file_id: erp_file_id}),
                                        headers: {
                                            'Content-Type': 'application/json',
                                            'Authorization':`Bearer ${user.token}`
                                        }
                                    })
                                    if(file){
                                        await file.json()
                                        .then( async fileJson => {
                                            const erpFileIdPersisted = fileJson.result.erp_file_id
                                            if(erpFileIdPersisted == erp_file_id){
                                                console.log('send confirmations');
                                                let infos
                                                if(repairFile.selectedOffer.intervention_type == 'Atelier'){
                                                    infos = {
                                                        type: 'Atelier', 
                                                        email: user.email, 
                                                        prenom: user.user.first_name,
                                                        id: id,
                                                        agence: repairFile.nearestAgency
                                                    }
                                                }
                                                if(repairFile.selectedOffer.intervention_type == 'Domicile'){
                                                    infos = {
                                                        type: 'Domicile',
                                                        email: user.email, 
                                                        prenom: user.user.first_name,
                                                        id: id, 
                                                        phoneAppointment: repairFile.phoneAppointment,
                                                        timeSlot: repairFile.selectedTimeSlotRef.hour,
                                                        phoneNumber: user.user.phone_number,
                                                        price: repairFile.price
                                                    }
                                                }
                                                // faire remote
                                                if(repairFile.selectedOffer.intervention_type == 'remote'){
                                                    infos = {
                                                        type: 'remote',
                                                        email: user.email, 
                                                        prenom: user.user.first_name,
                                                        id: id, 
                                                        phoneAppointment: repairFile.phoneAppointment,
                                                        timeSlot: repairFile.selectedTimeSlotRef.hour,
                                                        phoneNumber: user.user.phone_number,
                                                        price: repairFile.price
                                                    }
                                                }
                                                const file = await fetch('/api/v1/confirmationMail',{
                                                    method: 'POST',
                                                    body: JSON.stringify(infos),
                                                    headers: {
                                                        'Content-Type': 'application/json',
                                                        'Authorization':`Bearer ${user.token}`
                                                    }
                                                })
                                                if(file){
                                                    console.log('show confirm dans repairFile steps !');
                                                }
                                            }
                                        })
                                    }
                                }
                            }
                        })
                    })
        //             // 2 - paiement
        //             // 3 - si paiement == ok -> flux vers BO

        //             // 4 - si retour id_bo -> confirm : Mail, SMS
        //             // + message client 'dossier enregistré, confirmation par mail...'
        //             console.log('persisted');
                    }
            })
        })
    }
    return (
        <div className="repairFileStep">
        <div className="repairFileStepHeader">
            <p style={{marginLeft: '4vw'}}>{props.header}</p>
        </div>
            <div>
                {paymentIFrame}
            </div>
            <div className="nextStepBtnContainer">
                <button 
                    className="prevStepBtn modalButton"
                    onClick={handleSubmit}
                >Save</button>
                <button className="nextStepBtn modalButton" onClick={props.handlePrevClick}>Précédent</button>
            </div>
        </div>
    )
}

export default RepairFilePayment