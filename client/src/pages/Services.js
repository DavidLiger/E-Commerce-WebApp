import { Parallax, ParallaxLayer } from "@react-spring/parallax"
import { useRef } from "react"

const Services = () => {
    const parallax = useRef()

    return (
        <div className="services">
            <Parallax 
                pages={3} 
                ref={parallax}
                >
                <ParallaxLayer 
                    offset={0} 
                    className="center" 
                    onClick={() => parallax.current.scrollTo(1)}
                    style={{backgroundColor:"#e4f746"}}>
                    <div>
                        Services/Page 1
                    </div>
                </ParallaxLayer>
                <ParallaxLayer 
                    offset={1} 
                    className="center" 
                    onClick={() => parallax.current.scrollTo(2)}
                    style={{backgroundColor: "#EF9A9A"}}
                    >
                    <div>
                        Services/Page 2
                    </div>
                </ParallaxLayer>
                <ParallaxLayer 
                    offset={2} 
                    className="center" 
                    onClick={() => parallax.current.scrollTo(0)}
                    style={{backgroundColor: "#E57373"}}>
                    <div>
                        Services/Page 3
                    </div>
                </ParallaxLayer>
            </Parallax>
        </div>
    )
}

export default Services