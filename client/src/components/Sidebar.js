import { useState } from 'react';
import {
    FaHome,
    FaBars,
    FaStoreAlt,
    FaTools,
    FaCommentAlt,
    FaShoppingBag,
    FaHandsHelping,
    FaUserAstronaut
}from "react-icons/fa";
import { BiMap } from "react-icons/bi"
import { MdPeople } from "react-icons/md"
import { Link } from 'react-router-dom';
import Logo909 from '../assets/images/Logo909-blanc.png'


const Sidebar = () => {
    const[isOpen ,setIsOpen] = useState(false);
    const toggle = () => setIsOpen (!isOpen);
    const menuItem=[
        {
            path:"/",
            name:"Accueil",
            icon:<FaHome/>
        },
        {
            path:"/about",
            name:"909",
            icon:<FaStoreAlt/>
        },
        {
            path:"/services",
            name:"Nos offres",
            icon:<FaShoppingBag/>
        },
        {
            path:"/agencies",
            name:"Nos Agences",
            icon:<BiMap/>
        },
        {
            path:"/trades",
            name:"Nos Métiers",
            icon:<MdPeople/>
        },
        {
            path:"/products",
            name:"Interventions",
            icon:<FaTools/>
        },
        {
            path:"/articles",
            name:"Le blog",
            icon:<FaCommentAlt/>
        },
        {
            path:"/careers",
            name:"Carrières",
            icon:<FaUserAstronaut/>
        },
        {
            path:"/contact",
            name:"Contact",
            icon:<FaHandsHelping/>
        }
    ]
    
    return (
        <div className="sidebarContainer">
            <div  className='sideBarOverlay' style={{display: isOpen ? "block" : "none"}} onClick={toggle}></div>
            <div style={{width: isOpen ? "200px" : "60px"}} className="sidebar">
                <div className="top_section">
                        <img style={{display: isOpen ? "block" : "none", width:40, margin:'15px'}}
                                    src={Logo909}
                                    alt="909"
                                />
                    {/* <h1 style={{display: isOpen ? "block" : "none"}} className="logo">Logo</h1> */}
                    <div style={{marginLeft: isOpen ? "60px" : "0px"}} className="bars">
                        <FaBars onClick={toggle}/>
                    </div>
                </div>
                {
                    menuItem.map((item, index)=>(
                        <Link to={item.path} key={index} className="link">
                            <div className="icon">{item.icon}</div>
                            <div style={{display: isOpen ? "block" : "none"}} className="link_text">{item.name}</div>
                        </Link>
                    ))
                }
            </div>
        </div>
    );
};

export default Sidebar;