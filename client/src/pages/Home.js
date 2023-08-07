import { Parallax, ParallaxLayer } from "@react-spring/parallax"
import { useRef } from "react"

import Background01 from '../assets/images/salon_1.jpeg'
import { Link } from "react-router-dom"

const Home = () => {
    const parallax = useRef()

    return (
        <div className="home">
            {/* A remplacer par button simple (!loginModal)*/}
            {/* <LoginModal title={"Intervenir sur mon appareil"}></LoginModal> */}
            <Link to="/rendez-vous" className='repairLink'>Intervenir sur mon appareil</Link>
            <Parallax 
                pages={3} 
                ref={parallax}
                >
                <ParallaxLayer 
                    offset={0} 
                    className="center" 
                    onClick={() => parallax.current.scrollTo(1)}
                    style={{
                        backgroundImage:`url(${Background01})`,
                        backgroundSize: 'cover'
                        }}>
                    <div>
                        <div>
                            Home/Page 1
                        </div>
                        
                    </div>
                </ParallaxLayer>
                <ParallaxLayer 
                    offset={1} 
                    className="center" 
                    onClick={() => parallax.current.scrollTo(2)}
                    style={{backgroundColor: "#EF9A9A"}}
                    >
                    <div>
                        Home/Page 2
                    </div>
                </ParallaxLayer>
                <ParallaxLayer 
                    offset={2} 
                    className="center" 
                    onClick={() => parallax.current.scrollTo(0)}
                    style={{backgroundColor: "#E57373"}}>
                    <div>
                        Home/Page 3
                    </div>
                </ParallaxLayer>
            </Parallax>
        </div>
    )
}

export default Home