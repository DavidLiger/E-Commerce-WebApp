import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet'
import L from "leaflet";
import Marker909 from '../assets/images/909_marker_all_layers.png'
import MarkerShadow909 from '../assets/images/909_marker_shadow.png'

const MapViewer = (props) =>{
    const position = props.agency.geoloc.split(',')
    const lat = parseFloat(position[1])
    const long = parseFloat(position[0])

    const icon909= new L.Icon({
        iconUrl: Marker909,
        iconRetinaUrl: Marker909, 
        iconAnchor: new L.Point(62, 60),
        popupAnchor: new L.Point(2, -50),
        iconSize: new L.Point(125, 63),
        className: 'leaflet-div-icon'
    });

    return(
        <MapContainer center={[lat, long]} zoom={13} scrollWheelZoom={false} style={{ zIndex: 10 }}>
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker icon={icon909} position={[lat, long]}>
                <Popup>
                    <div style={{display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'center'}}>
                        <span style={{fontWeight:'bold', fontSize:'1.2em', marginBottom:'5px'}}>{props.agency.name}</span>
                        <span>{props.schedulesWeek}</span>
                        <span>{props.schedulesHoursFirst}</span>
                        <span>{props.schedulesHoursSecond}</span>
                        <span style={{fontWeight:'bold', fontStyle:'italic', marginTop:'5px'}}>{props.agency.phone}</span>
                    </div>
                </Popup>
            </Marker>
        </MapContainer>
    )
}

export default MapViewer