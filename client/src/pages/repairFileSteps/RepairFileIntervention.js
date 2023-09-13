// import 'leaflet/dist/leaflet.css';
import { useSelector } from "react-redux"
import AgencyInfos from "../../components/AgencyInfos"
import AcceptCGV from "../../components/AcceptCGV"

const RepairFileIntervention = (props) => {
    const { repairFile } = useSelector((store) => store.repairFile)
    const { user } = useSelector((store) => store.user.user)
    const { intervention_type } = repairFile.selectedOffer

    return (
        <div className="repairFileStep">
            <div className="repairFileStepHeader">
                <p style={{marginLeft: '4vw'}}>{props.header}</p>
            </div>
                {intervention_type && intervention_type == 'Atelier' &&
                <div style={{width:'80%', marginLeft:'10%', marginTop:'5vh'}}>
                    <AgencyInfos agency={repairFile.nearestAgency} />
                </div>
                }
            <div className="recapText">
                {intervention_type == 'Domicile' &&
                    <div className='overviewDiv' style={{width:'80%', marginLeft:'10%',flexDirection:'column', padding:'5px'}}>
                        <p>Madame, Monsieur {user.last_name}</p>
                        <p>Vous avez choisi diagnostique à distance et une intervention à domicile avec un expert
                            909 pour : </p>
                        <span>Appareil : {repairFile.device.name}</span>
                        <span>De marque : {repairFile.brand}</span>
                        {repairFile.serialNumber &&
                            <span>N° de série : {repairFile.serialNumber}</span>
                        }
                        <span>N’étant plus sous garantie</span>
                        <p>Pour le problème déclaré suivant : {repairFile.issue.issue}</p>
                        {repairFile.comment &&
                            <span>Informations complémentaires : {repairFile.comment}</span>
                        }
                        {repairFile.selectedTimeSlotRef == 'morning' ? 
                            <span>Date du RDV téléphonique : {repairFile.phoneAppointment}, le matin</span> :
                            <span>Date du RDV téléphonique : {repairFile.phoneAppointment}, l'après-midi'</span>
                        }
                        <p>N° de téléphone : {user.phone_number}</p>
                        <span>Adresse pour l’intervention à domicile:</span>
                        <span>{user.adress}</span>
                                <span>{user.zipcode}</span>
                                <span>{user.city_name}</span>
                        <span>Rappel : En cas de réparation avec pièce(s), un devis sera établi et vous sera envoyé par
                        email à l’adresse suivante :</span>
                        <p>{user.email}</p>
                        <p>pour approbation et règlement</p>
                        <AcceptCGV missingValues={props.missingValues}/>
                        <p>En tenant compte des informations renseignées, cette intervention 909 vous sera
                        facturée : {repairFile.price}€</p>
                    </div>
                }
                {(intervention_type == 'Atelier' || intervention_type == 'remote') &&
                    <div className='overviewDiv' style={{width:'80%', marginLeft:'10%',flexDirection:'column', padding:'5px'}}>
                        <p>Madame, Monsieur {user.last_name}</p>
                        <p>Vous avez choisi {intervention_type == 'Atelier' ?
                                <span>une prise en charge en atelier, dans l'agence de {repairFile.nearestAgency.name} pour : </span> :
                                <span>un diagnostic à distance</span>
                            }
                        </p>
                        <span>Appareil : {repairFile.device.name}</span>
                        <span>De marque : {repairFile.brand}</span>
                        {repairFile.serialNumber &&
                            <span>N° de série : {repairFile.serialNumber}</span>
                        }
                        <span>N’étant plus sous garantie</span>
                        <p>Pour le problème déclaré suivant : {repairFile.issue.issue}</p>
                        {repairFile.comment &&
                            <span>Informations complémentaires : {repairFile.comment}</span>
                        }
                        <p>N° de téléphone : {user.phone_number}</p>
                        <span>Rappel : En cas de réparation avec pièce(s), un devis sera établi et vous sera envoyé par
                        email à l’adresse suivante :</span>
                        <p>{user.email}</p>
                        <p>pour approbation et règlement</p>
                        <AcceptCGV missingValues={props.missingValues}/>
                        <p>En tenant compte des informations renseignées, cette intervention 909 vous sera
                        facturée : {repairFile.price}€</p>
                    </div>
                }
            </div>
            <div className='nextStepBtnContainer'>
                <button className="prevStepBtn modalButton" onClick={props.handlePrevClick}>Précédent</button>
                <button className="nextStepBtn modalButton" onClick={props.handleNextClick}>Suivant</button>
            </div>
        </div>
    )
}

export default RepairFileIntervention