import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from "react-redux";
import { setRepairFile } from '../../features/repairFileSlice';
// components
import { store } from '../../store';
import { FormControlLabel, Radio, RadioGroup } from '@mui/material';
import Select from 'react-select'
import { Link } from 'react-router-dom';
import DeviceModal from "../../components/DeviceModal";


const RepairFileDevice = (props) => {
    // devices recupérés au lancement de l'app avec getDevices
    // icns from flaticon.com
    const { devices } = useSelector((store) => store.devices)
    const { brands } = useSelector((store) => store.brands)
    const [ list, setList ] = useState([])
    const [ isGuaranteed, setIsGuaranteed ] = useState(false)
    const [ isGuaranteeKnown, setIsGuaranteeKnown ] = useState(true)
    const [ brand, setBrand ] = useState()
    const [ category, setCategory ] = useState('')
    const [ warrantyType, setWarrantType ] = useState('HG')
    const dispatch = useDispatch()

    const options = brands

    // save selected item in list in store and set it with green bg
    useEffect(()=>{
        // recupère les devices et set la list à chaque lancement du composant
        // setList(devices)
        async function fetchSubCategories() {
            devices.map( async device =>{
                await fetch('/api/v1/rates/subcategory',{
                    method: 'POST',
                    body: JSON.stringify({"device_id":device.id}),
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                .then(async response =>{
                    await response.json()
                    .then( async json => {
                        setList(list => [...list, { ...device, json: json}])
                    })
                })
            })
        }
        if(list.length == 0){
            fetchSubCategories()
        }
        // recupère le state depuis le store de Redux DANS useEffect !!
        const { repairFile } = store.getState().repairFile;
        if(repairFile){
            const { device, category, brand, warrantyType } = store.getState().repairFile.repairFile;
            if(device){
                setSelectedIcon(device.name)
            }
            if(category){
                setCategory(category)
            }
            if(brand){
                setBrand(brand)
            }
            if(warrantyType){
                setWarrantType(warrantyType)
                setSelectedRadioBtn(warrantyType)
            }
        }
        
        // eslint-disable-next-line
      },[devices])

    const setSelectedIcon = name => {
        console.log(name);
        const newList = list.map((item) => {
            if (item.name === name) {
              const updatedItem = {...item, selected: true}
              return updatedItem;
            }
            else{
              const updatedItem = {...item, selected: false}
              return updatedItem;
            }
          });
          setList(newList);
    }

    const handleBrandInputChange = (value) => {
        if(value){
            dispatch(setRepairFile({brand: Object.values(value)[0]}))
            setBrand(value)
        }else{
            dispatch(setRepairFile({brand: ''}))
            setBrand('')
        }
    }

    const handleWarrantyRadioGroup = warrantyType => {
        dispatch(setRepairFile({warrantyType: warrantyType}))
        setSelectedRadioBtn(warrantyType)
    }

    const setSelectedRadioBtn = warrantyType => {
        setWarrantType(warrantyType)
        if(warrantyType === 'IDK'){
            setIsGuaranteeKnown(false)
        }
        if(warrantyType === 'SG'){
            setIsGuaranteeKnown(true)
            setIsGuaranteed(true); 
        }
        if(warrantyType === 'HG'){
            setIsGuaranteeKnown(true)
            setIsGuaranteed(false); 
        }
    }

    return (
        <div className="repairFileStep">
            <div className="repairFileStepHeader">
                <p style={{marginLeft: '4vw'}}>{props.header}</p>
            </div>
            <div className='iconsContainer'>
                {list && list.map((item, index)=>(
                    <DeviceModal 
                        key={index}
                        item={item}
                        setCategory={setCategory}
                        setSelectedIcon={setSelectedIcon}
                    />
                    ))
                }
            </div>
            {props.missingValues.length > 0 && props.missingValues.includes('category') && !category &&
                    <span className='warning' style={{marginLeft: '8vw', fontSize: '0.8em'}}>Merci de choisir une catégorie de produit</span>
                }
            <div className='formContainer'>
                <RadioGroup 
                    style={{display: 'flex', flexDirection: 'row', alignItems: 'center', width: '80%'}} 
                    name="use-radio-group" 
                    defaultValue={warrantyType}
                    >
                        <label className='radioLabel'>Êtes-vous sous garantie ? </label>
                        <FormControlLabel
                            style={{marginLeft: '15px'}}
                            value={'SG'}
                            control={<Radio/>}
                            label={'Oui'}
                            onClick={()=>{handleWarrantyRadioGroup('SG')}}
                            checked={'SG' === warrantyType}
                            />
                        <FormControlLabel
                            value={'HG'}
                            control={<Radio/>}
                            label={'Non'}
                            onClick={()=>{handleWarrantyRadioGroup('HG')}}
                            checked={'HG' === warrantyType}
                            />
                        <FormControlLabel
                            value={'IDK'}
                            control={<Radio/>}
                            label={'Je ne sais pas'}
                            onClick={()=>{handleWarrantyRadioGroup('IDK')}}
                            checked={'IDK' === warrantyType}
                            />
                </RadioGroup>
                {!isGuaranteeKnown ?
                        <p className='footerLink' style={{ display: 'flex' , flexDirection: 'row', fontSize: '0.8em', cursor: 'default'}}>
                            Pour vous aider à trouver la réponse, n’hésitez pas à consultez notre
                            <Link to="/faq" style={{marginLeft: '6px', color: '#3f2564'}}>FAQ</Link>
                        </p>
                    :
                    (isGuaranteed ?
                        // A REPRENDRE après le développement du parcours complet
                        // modal pour le traitement des dossiers sous garantie // btn "continuer avec un appareil sous garantie"
                        <span className='warning'>Pour un appareil sous garantie, merci de contacter directement votre constructeur (Samsung, Hisense etc.)</span>
                        :
                        <div>
                            <label style={{marginTop: '3vh'}}>Quelle est la marque de votre appareil ? </label>
                            <Select 
                                value={options.find(op => {
                                    return op.nomMarque === brand
                                 })}
                                options={options} 
                                getOptionLabel={(option) => option.nomMarque}
                                placeholder='ex : Samsung' 
                                onChange={handleBrandInputChange} 
                                styles={colourStyles}/>
                            {props.missingValues.length > 0 && props.missingValues.includes('brand') && !brand &&
                                <span className='warning'>Merci de choisir une marque</span>
                            }
                        </div>)
                }
            </div>
                {isGuaranteeKnown && !isGuaranteed &&
                    <div className='nextStepBtnContainer'>
                        <button className="prevStepBtn modalButton" onClick={props.handlePrevClick}>Précédent</button>
                        <button className="nextStepBtn modalButton" onClick={props.handleNextClick}>Suivant</button>
                    </div>
                }
        </div>
    )
}

const colourStyles = {
    control: styles => ({ ...styles, width: '80%', marginTop: '1vh' }),
    option: (styles, {isDisabled}) => {
      return {
        ...styles,
        backgroundColor: isDisabled ? 'red' : 'white',
        color: '#595959',
        cursor: isDisabled ? 'not-allowed' : 'default'
      }
    }

  }

export default RepairFileDevice