import { Parallax, ParallaxLayer } from "@react-spring/parallax"
import { useRef } from "react"
import '../css/home.css';

import Background01 from '../assets/images/salon_whited.jpeg'
import LogoWhite from '../assets/images/Logo909-blanc.png'
import homeSavoir from '../assets/images/home_savoir.svg'
import homeConfiance from '../assets/images/home_confiance.svg'
import homeSimplicity from '../assets/images/home_simplicity.svg'
import homeInter from '../assets/images/reparation-a-domicile.svg'
import homeRemote from '../assets/images/diagnostic-a-distance.svg'
import homeWorkshop from '../assets/images/reparation-en-atelier.svg'
import { Link } from "react-router-dom"
import 'react-tooltip/dist/react-tooltip.css'
import FranceSimpleMap from "../components/FranceSimpleMap"

const Home = () => {
    const parallax = useRef()
    const franceMap = useRef()

    return (
        <div className="home">
            {/* A remplacer par button simple (!loginModal)*/}
            {/* <LoginModal title={"Intervenir sur mon appareil"}></LoginModal> */}
            <Parallax 
                pages={5} 
                ref={parallax}
                >
                <ParallaxLayer 
                    offset={0} 
                    className="center" 
                    onClick={() => parallax.current.scrollTo(1)}
                    style={{
                        backgroundImage:`url(${Background01})`,
                        backgroundSize: 'cover',
                        cursor: 'pointer'
                        }}>
                    <div style={{display: 'flex', flexDirection: 'column', width: '100%', height:'100%', alignItems: 'center', marginTop: '35%'}}>
                        <div style={{display: 'flex', flexDirection: 'column', width: '100%', alignItems: 'center', justifyContent: 'center'}}>
                            <div className="page1TitleContainer">
                                <div style={{rotate: '-12deg', fontWeight: 'bold', fontSize: '3.4em'}}>
                                    <span style={{color: '#3f2564', fontStyle: 'italic'}}>Faites du </span><span style={{textIndent: '8px', color: '#7dcb97', fontStyle: 'italic'}}> neuf</span>
                                </div>
                                <div style={{rotate: '-12deg', fontWeight: 'bold', fontSize: '3.4em'}}>
                                    <span style={{color: '#7dcb97', fontStyle: 'italic'}}>sans neuf </span><span style={{textIndent: '8px', color: '#3f2564', fontStyle: 'italic'}}>, réparez !</span>
                                </div>
                            </div>
                            <div className="page1TitleContainer">
                                <div style={{rotate: '-12deg', fontWeight: 'bold', fontSize: '1.8em'}}>
                                    <span style={{color: '#3f2564', fontStyle: 'italic'}}>Adoptez le réflexe 909</span>
                                </div>
                                <div style={{rotate: '-12deg', fontWeight: 'bold', fontSize: '1.8em'}}>
                                    <span style={{color: '#3f2564', fontStyle: 'italic'}}>et retrouvez votre appareil fonctionnel</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </ParallaxLayer>
                <ParallaxLayer 
                    offset={1} 
                    className="center" 
                    onClick={() => parallax.current.scrollTo(2)}
                    style={{
                        backgroundColor: '#3f2564',
                        cursor: 'pointer'
                    }}
                    >
                    <div className="page2Container">
                        <div className="page2TitleContainer">
                            <span style={{fontWeight: 'bold', fontSize: '2.1em', color: '#fff', marginRight: '16px'}}>La réparation par</span><img style={{height: '75px'}} src={LogoWhite} alt="logo909white"/>
                        </div>
                        <div className="page2Text">
                            Bénéficiez de notre service d’intervention à domicile ou à distance pour tous vos appareils électroniques et électroménagers qu’ils soient sous garantie ou hors garantie.
                        </div>
                        <div className="page2InfosContainer">
                            <div className="infoColumn">
                                <img style={{height: '75px'}} src={homeSavoir} alt="homeSavoir"/>
                                <div style={{display: 'flex', flexDirection: 'column'}}>
                                    <span style={{fontWeight: 'bold'}}>Savoir-faire</span>
                                    <span style={{fontSize: '0.7em'}}>
                                        30 ans d’expérience dans l’intervention à domicile ou en atelier et dans le reconditionnement de produits
                                    </span>
                                </div>
                            </div>
                            <div className="infoColumn">
                                <img style={{height: '75px'}} src={homeConfiance} alt="homeConfiance"/>
                                <div style={{display: 'flex', flexDirection: 'column'}}>
                                    <span style={{fontWeight: 'bold'}}>Confiance</span>
                                    <span style={{fontSize: '0.7em'}}>
                                        Nous travaillons au nom de Samsung, Hisense, Panasonic pour réparer vos appareils : TV, lave-linge, four…
                                    </span>
                                </div>
                            </div>
                            <div className="infoColumn">
                                <img style={{height: '75px'}} src={homeSimplicity} alt="homeSimplicity"/>
                                <div style={{display: 'flex', flexDirection: 'column'}}>
                                    <span style={{fontWeight: 'bold'}}>Simplicité</span>
                                    <span style={{fontSize: '0.7em'}}>
                                        Ne vous posez pas de questions, quelque soit votre appareil nous le réparons chez vous ou à distance
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </ParallaxLayer>
                <ParallaxLayer 
                    ref={franceMap}
                    offset={2} 
                    className="center" 
                    onClick={() => parallax.current.scrollTo(3)}
                    style={{
                        backgroundColor: '#fff',
                        cursor: 'pointer'
                    }}>
                    <div style={{display: 'flex', flexDirection:'column', width: '100%', height: '100%', alignItems: 'center'}}>
                        <div className="page3TitleContainer">
                            <span style={{color: '#3f2564'}}>Notre réseau national </span><span style={{textIndent: '8px', color: '#7dcb97'}}> d'agences</span>
                        </div>
                        <FranceSimpleMap/>
                    </div>
                </ParallaxLayer>
                <ParallaxLayer 
                    offset={3} 
                    className="center" 
                    onClick={() => parallax.current.scrollTo(4)}
                    style={{
                        backgroundColor: '#3f2564',
                        backgroundSize: 'cover',
                        cursor: 'pointer'
                        }}>
                    <div style={{display: 'flex', flexDirection: 'column', width: '100%', height:'100%', alignItems: 'center'}}>
                        <div className="page4TitleContainer">
                            <span style={{color: '#fff'}}>Des offres </span><span style={{textIndent: '8px', color: '#7dcb97'}}> pour tous</span>
                        </div>
                        <div className="page4InfosContainer">
                            <div className="infoColumnWhiteBG">
                                <div className="infosColumnWhiteBGTitle">
                                    <img style={{height: '75px'}} src={homeInter} alt="homeSavoir"/>
                                    <div className="infosColumnWhiteBGTitletext">
                                        <span style={{fontWeight: 'bold'}}>Intervention à domicile</span>
                                        <span style={{fontWeight: 'bold', color: '#7dcb97'}}>sur devis</span>
                                    </div>
                                </div>
                                <span style={{fontSize: '0.7em'}}>
                                    Par appareil & hors pièces détachées
                                </span>
                                <ul style={{fontSize: '0.6em', marginLeft: '0px', paddingLeft: '20px'}}>
                                    <li>Pré-diagnostic de votre panne</li>
                                    <li>Déplacement et intervention à domicile* d’un expert 909</li>
                                    <li>Prestation garantie 3 mois</li>
                                </ul>
                                <span style={{fontSize: '0.5em', marginTop: '5px'}}>*Dans la limite des zones d’intervention proposées par 909 pour des prestations ateliers ou à domicile. Pour plus de détails, cliquez 
                                    <Link 
                                    style={{paddingLeft: '10px'}}
                                        onClick={(e) => {
                                        e.stopPropagation()
                                        parallax.current.scrollTo(2)}}
                                    >ici</Link>
                                </span>
                            </div>
                            <div className="infoColumnWhiteBG">
                            <div className="infosColumnWhiteBGTitle">
                                <img style={{height: '75px'}} src={homeRemote} alt="homeConfiance"/>
                                    <div className="infosColumnWhiteBGTitletext">
                                        <span style={{fontWeight: 'bold'}}>Diagnostic à distance</span>
                                        <span style={{fontWeight: 'bold',  color: '#7dcb97'}}>35 €</span>
                                    </div>
                                </div>
                                <span style={{fontSize: '0.7em'}}>
                                    Par appareil & hors pièces détachées
                                </span>
                                <ul style={{fontSize: '0.6em', marginLeft: '0px', paddingLeft: '20px'}}>
                                    <li>Appel audio/vidéo avec un expert 909</li>
                                    <li>Si possible, on vous solutionne immédiatement !</li>
                                    <li>Sinon, 909 vous établi un devis pour une intervention*</li>
                                </ul>
                                <span style={{fontSize: '0.5em', marginTop: '5px'}}>*Dans la limite des zones d’intervention proposées par 909 pour des prestations ateliers ou à domicile. Pour plus de détails, cliquez 
                                    <Link 
                                    style={{paddingLeft: '10px'}}
                                        onClick={(e) => {
                                        e.stopPropagation()
                                        parallax.current.scrollTo(2)}}
                                    >ici</Link>
                                </span>
                            </div>
                            <div className="infoColumnWhiteBG">
                                <div className="infosColumnWhiteBGTitle">
                                    <img style={{height: '75px'}} src={homeWorkshop} alt="homeSimplicity"/>
                                    <div className="infosColumnWhiteBGTitletext">
                                        <span style={{fontWeight: 'bold'}}>Intervention en atelier</span>
                                        <span style={{fontWeight: 'bold', color: '#7dcb97'}}>sur devis</span>
                                    </div>
                                </div>
                                <span style={{fontSize: '0.7em'}}>
                                    Par appareil & hors pièces détachées
                                </span>
                                <ul style={{fontSize: '0.6em', marginLeft: '0px', paddingLeft: '20px'}}>
                                    <li>Diagnostic et réparation en atelier</li>
                                    <li>Dépôt par vos soins dans nos ateliers</li>
                                    <li>Réparation garantie 3 mois</li>
                                </ul>
                                <span style={{fontSize: '0.5em', marginTop: '5px'}}>*Dans la limite des zones d’intervention proposées par 909 pour des prestations ateliers ou à domicile. Pour plus de détails, cliquez 
                                    <Link 
                                    style={{paddingLeft: '10px'}}
                                        onClick={(e) => {
                                        e.stopPropagation()
                                        parallax.current.scrollTo(2)}}
                                    >ici</Link>
                                </span>
                            </div>
                        </div>
                    </div>
                </ParallaxLayer>
                <ParallaxLayer 
                    offset={4} 
                    className="center" 
                    onClick={() => parallax.current.scrollTo(0)}
                    style={{
                        backgroundColor: '#3f2564',
                        cursor: 'pointer'
                    }}
                    >
                    <div style={{display: 'flex', flexDirection: 'column', width: '80%', marginLeft: '10%', height:'90%', alignItems: 'center'}}>
                        <div style={{height: '25%', width: '80%', marginLeft: '10%'}}>
                            <span style={{fontWeight: 'bold', fontSize: '2.1em', color: '#fff', marginRight: '6px'}}>Vous souhaitez tenter</span><span style={{fontWeight: 'bold', fontSize: '2.1em', color: '#7dcb97'}}> l'aventure en solo ?</span>
                        </div>
                        <div style={{width: '80%', height:'20%', alignItems: 'center', color: '#fff', fontSize: '1.3em', justifyContent: 'center'}}>
                            <span style={{color: '#fff', marginRight: '6px'}}>Contactez-nous et faites votre demande de</span>
                            <span style={{color: '#7dcb97', marginRight: '6px'}}> pièces détachées</span>     
                            <span style={{color: '#fff'}}>via notre formulaire</span>                     
                        </div>
                        <Link 
                            to="/contact"
                            style={{paddingLeft: '10px'}}
                        >Contactez-nous</Link>
                    </div>
                </ParallaxLayer>
            </Parallax>
        </div>
    )
}

const customStyles = {
}

export default Home