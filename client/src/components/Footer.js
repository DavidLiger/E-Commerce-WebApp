import logoVisa from '../assets/images/visa.png'
import logoCB from '../assets/images/CB.png'
import logoMasterCard from '../assets/images/MasterCard.png'
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <div className="footer">
            <Link to="/legal" className='footerLink' style={{paddingLeft:80}} >Mentions légales</Link>
            <Link to="/rgpd" className='footerLink'>Politique de conformité RGPD</Link>
            <Link to="/cgv" className='footerLink'>CGV</Link>
            <p style={{cursor:'default'}}>Copyright 2023</p>
            <p style={{cursor:'default'}}>Tous droits réservés</p>
            <div className='footerImgContainer'>
                <img className='footerImg' src={logoVisa} alt="visa"/>
                <img className='footerImg' src={logoCB} alt="CB"/>
                <img className='footerImg' style={{paddingRight: '45px'}} src={logoMasterCard} alt="CB"/>
            </div>
        </div>
    )
}

export default Footer