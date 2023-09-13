import Tippy from "@tippyjs/react"
import { useState } from "react"
import { useEffect } from "react"
import { useSelector } from "react-redux"
import { ComposableMap, Geographies, Geography, Marker } from "react-simple-maps"
import geoUrl from '../assets/maps/fr-departments.json'
import { Tooltip } from "react-tooltip"

const FranceSimpleMap = () => {
    const { agencies } = useSelector((store) => store.agencies)
    const [ agencyList, setAgencyList ] = useState([])
    const [tooltipContent, setTooltipContent] = useState('');
    const [ deptsNameList, setDeptsNameList ] = useState([])

    useEffect(()=> {
        async function getDeptsName() {
            await fetch('/api/v1/deptsName')
                .then(async response =>{
                    await response.json()
                    .then( async json => {
                        json.map((obj)=>{
                            setDeptsNameList(deptsNameList => [...deptsNameList, obj.dept_name])
                        })
                    })
                })
        }
        if(deptsNameList.length == 0){
            getDeptsName()
        }
        const newList = agencies.map((agency) => {
            const updatedItem = {...agency, longitude: parseFloat(agency.geoloc.split(',')[0]), latitude: parseFloat(agency.geoloc.split(',')[1])}
            return updatedItem;
        });
        setAgencyList(newList);
    }, [deptsNameList, agencies])

    return (
        <>
            <ComposableMap
                projectionConfig={{
                    scale: 2800,
                    center: [2, 47]
                }}
                width={800}
                height={800}
            >
                <Geographies 
                    geography={geoUrl}
                    parseGeographies={(geos) => {
                        return geos.map((g) => {
                        // Process geographies here...
                        //   console.log(g);
                        if(deptsNameList.includes(g.properties.NAME_2)){
                            // ajout propriété 'service_cover' soit nom dept soit 'uniquement à distance'
                            g.properties.fill = "#341a58"
                            g.properties.service_cover = g.properties.NAME_2
                        }else{
                            g.properties.fill = "#8066a5"
                            g.properties.service_cover = 'diagnostic à distance uniquement'
                        }
                        return g
                        })
                    }}
                >
                    {({ geographies }) =>
                    geographies.map((geo) => (
                        <Tippy 
                            key={geo.rsmKey}
                            content={tooltipContent} 
                            delay={[350, 0]} 
                            followCursor= {true}
                            placement={'top'} 
                            theme={'tomato'}
                            >
                            <Geography 
                                key={geo.rsmKey} 
                                id={geo.rsmKey}
                                geography={geo} 
                                onMouseEnter={() => {
                                    setTooltipContent(geo.properties.service_cover)
                                }}
                                onMouseLeave={() => {
                                    setTooltipContent("");
                                }}
                                style={{
                                    default: {
                                    fill: geo.properties.fill,
                                    },
                                    hover: {
                                    fill: "#a1eebb",
                                    },
                                    pressed: {
                                    fill: "#73c28d",
                                    },
                                }}
                            />
                        </Tippy>
                    ))
                    }
                </Geographies>
                {agencyList && 
                    agencyList.map((agency, index) =>(
                        <Marker key={index} coordinates={[agency.longitude, agency.latitude]}>
                            <circle id={`${agency.name}-anchor-element`} r={8} fill="#73c28d" />
                        </Marker>
                    ))
                }
            </ComposableMap>
            {agencyList && 
                agencyList.map((agency, index) =>(
                    <Tooltip key={index} anchorSelect={`#${agency.name}-anchor-element`} place="top">
                        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                            <span>{agency.address}</span>
                            <span>{agency.zipcode} {agency.city}</span>
                        </div>
                    </Tooltip>
                ))
            }
        </>
    )
}

export default FranceSimpleMap