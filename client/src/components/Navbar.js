import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux"
import { logout } from "../features/userSlice"
import { clearArticles } from "../features/articlesSlice";
import { setPath } from '../features/pathSlice';

import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { usePopupState, bindTrigger, bindMenu } from 'material-ui-popup-state/hooks'
import { FaUserAlt, FaUserCog } from "react-icons/fa";
import { MdLogin, MdLogout } from "react-icons/md";
import { AiOutlineForm } from "react-icons/ai";
import { TbDeviceDesktopAnalytics } from "react-icons/tb";


import Logo909 from '../assets/images/Logo909-violet.jpg'
import LogoFB from '../assets/images/logo_FB.png'
import LogoIG from '../assets/images/logo_IG.png'
import LogoLI from '../assets/images/logo_LI.png'
import LogoYT from '../assets/images/logo_YT.png'
import { setRepairFile } from "../features/repairFileSlice";

const Navbar = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { user } = useSelector((store) => store.user)
    const popupState = usePopupState({ variant: 'popover', popupId: 'demoMenu' })

    const handleLogoutClick = () => {
        localStorage.removeItem('user')
        dispatch(logout())
        dispatch(clearArticles())
        dispatch(setPath({path:'/'}))
        dispatch(setPath({indexStepper:0}))
        navigate("/");
        popupState.close()
    }

    const handleProfileClick= () => {
        navigate("/profile");
    }

    const handleAdminClick = () => {
        navigate("/admin");
    }

    return (
        <header>
            <div className="center">
                <div style={{display:'flex', width:'20%'}}>
                    <div>
                        <a target="_blank" href="https://www.facebook.com/909-102618342183903/?ref=pages_you_manage" rel="noreferrer">
                            <img className="socialNetworkButton"
                                    src={LogoFB}
                                    alt="FB"
                                />
                        </a>
                        <a target="_blank" href="https://www.instagram.com/909_fr/" rel="noreferrer">
                            <img className="socialNetworkButton"
                                    src={LogoIG}
                                    alt="FB"
                                />
                        </a>
                    </div>
                    <div>
                        <a target="_blank" href="https://www.linkedin.com/company/909services" rel="noreferrer">
                            <img className="socialNetworkButton"
                                    src={LogoLI}
                                    alt="LI"
                                />
                        </a>
                        <a target="_blank" href="https://www.youtube.com/channel/UC4Rx6WWi4uG3y7vK2-syOBg" rel="noreferrer">
                            <img className="socialNetworkButton"
                                    src={LogoYT}
                                    alt="YT"
                                />
                        </a>
                    </div>
                </div>
                <Link to="/" className="navbarLogoContainer">
                    <img className="navbarLogo"
                        src={Logo909}
                        alt="909"
                    />
                </Link>
                <nav style={{display:'flex', width:'35%', justifyContent:'space-between', flexDirection:'row'}}>
                    <Link to="/rendez-vous" className="repairLink" style={{display:'flex', justifyContent:'flex-start', alignItems:'flex-start'}}>Je prends RDV</Link>
                    {user && (
                        <div style={{marginRight:'25px'}}>
                            <Button 
                                variant="contained" {...bindTrigger(popupState)}
                                style={{padding: 12, backgroundColor: '#7dcb97'}}
                            ><FaUserAlt style={{fontSize: '1.8em'}}/></Button>
                            <Menu {...bindMenu(popupState)}>
                                <MenuItem onClick={handleProfileClick}><FaUserCog style={{fontSize: '1.4em', marginRight:'10px'}}/>{user.user.first_name}</MenuItem>
                                {user && user.user.role == 'admin' &&
                                    <MenuItem onClick={handleAdminClick}><TbDeviceDesktopAnalytics style={{fontSize: '1.4em', marginRight:'10px'}}/>Admin</MenuItem>
                                }
                                <MenuItem onClick={handleLogoutClick}><MdLogout style={{fontSize: '1.4em', marginRight:'10px'}}/>Log out</MenuItem>
                            </Menu>
                        </div>
                    )}
                    {!user && (
                        <div style={{marginRight:'25px'}}>
                            <Button 
                                variant="contained" {...bindTrigger(popupState)}
                                style={{padding: 12, backgroundColor: '#7dcb97'}}
                            ><FaUserAlt style={{fontSize: '1.8em'}}/></Button>
                            <Menu {...bindMenu(popupState)}>
                                <MenuItem>
                                    <MdLogin style={{fontSize: '1.4em', marginRight:'10px'}}/>
                                    <Link to="/login" style={{textDecorationLine: 'none'}}>S'identifier</Link>
                                </MenuItem>
                                <MenuItem>
                                    <AiOutlineForm style={{fontSize: '1.4em', marginRight:'10px'}}/>
                                    <Link to="/signup" style={{textDecorationLine: 'none'}}>Créer un compte</Link>
                                </MenuItem>
                            </Menu>
                        </div>
                    )}
                </nav>
            </div>
        </header>   
    )
}

export default Navbar