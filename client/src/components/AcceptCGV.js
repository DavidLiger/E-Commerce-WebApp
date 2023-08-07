import { useDispatch, useSelector } from "react-redux"
import { Checkbox } from "@mui/material"
import { useState } from "react"
import { Link } from 'react-router-dom';
import { setRepairFile } from "../features/repairFileSlice";

const AcceptCGV = (props) => {
    const [ checkedCGV, setCheckedCGV] = useState(false)
    const dispatch = useDispatch()

    const handleCheckedCGV = () => {
        let toggle = !checkedCGV
        setCheckedCGV(toggle)
        if(!checkedCGV){
            dispatch(setRepairFile({acceptCGV:true}))
        }else{
            dispatch(setRepairFile({acceptCGV:''}))
        }
    }

    return(
        <div style={{display:'flex', flexDirection:'column', width:'80%',alignItems:'center'}}>
            <div style={{display:'flex', flexDirection:'row', width:'100%', height:'100%'}}>
                <div style={{display:'flex', alignItems:'center', justifyContent:'center', width:'25px', height:'100%'}}>
                    <Checkbox
                        checked={checkedCGV}
                        onChange={handleCheckedCGV}
                        inputProps={{ 'aria-label': 'controlled' }}
                    />
                </div>
                <p style={{marginLeft:'20px'}}>J’ai compris et j’accepte <Link to="/cgv">les Conditions Générales de Vente 909</Link> et
                    déclare les informations, mentionnées ci-dessus, correctes.
                </p>
            </div>
                {props.missingValues.length > 0 && props.missingValues.includes('acceptCGV') && !checkedCGV &&
                    <span className='warning center' style={{fontSize:'1em'}}>Merci d'accepter les conditions générales de ventes</span>
                }
        </div>
    )
}

export default AcceptCGV