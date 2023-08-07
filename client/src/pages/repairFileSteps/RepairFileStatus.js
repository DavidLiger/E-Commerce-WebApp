import { Link } from "react-router-dom"
import Background from '../../assets/images/repairFileStatus_BG_opacity_half.png'

const RepairFileStatus = (props) => {

    return (
        <div className="repairFileStep" style={{
            maxHeight: 1200,
            backgroundImage:`url(${Background})`,
            backgroundSize: 'cover',
            }}>
            <div className="repairFileStepHeader">
                <p style={{marginLeft: '4vw'}}>{props.header}</p>
            </div>
            <div className="statusBtnContainer">
                <button className="statusBtn" onClick={props.handleNextClick}>Particulier</button>
                <Link className="statusBtn" to="/contact">Professionnel</Link>
            </div>
        </div>
    )
}

export default RepairFileStatus