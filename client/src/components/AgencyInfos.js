import MapViewer from "./MapViewer"

const AgencyInfos = (props)=>{
    const { schedules, name, zipcode, city, phone, address } = props.agency

    const schedulesFormat = schedules.indexOf('de')
    const schedulesWeek = schedules.substring(0, schedulesFormat)
    const schedulesHours = schedules.substring(schedulesFormat, schedules.length)
    const schedulesHoursFormat = schedulesHours.indexOf('et')
    const schedulesHoursFirst = schedulesHours.substring(0, schedulesHoursFormat)
    const schedulesHoursSecond = schedulesHours.substring(schedulesHoursFormat, schedulesHours.length)

    return(
        <div style={{position:'relative',display:'flex', flexDirection:'row', width:'100%'}}>
            <div className="overviewDiv" style={{display:'flex', width:'50%', height:'30vh', marginLeft:'4%'}}>
                <MapViewer
                    agency={props.agency}
                    schedulesWeek={schedulesWeek}
                    schedulesHoursFirst={schedulesHoursFirst}
                    schedulesHoursSecond={schedulesHoursSecond}
                />
            </div>
            <div className="agencyInfos" style={{width:'40%', marginLeft:'2%', fontSize:'0.9em'}}>
                <span>{name}</span>
                <span style={{marginTop:'2vh'}}>{address}</span>
                <span>{zipcode} {city}</span>
                {/* <span></span> */}
                <span style={{marginTop:'2vh'}}>Ouvert :</span>
                <span>{schedulesWeek}</span>
                <span>{schedulesHoursFirst}</span>
                <span>{schedulesHoursSecond}</span>
                <span style={{marginTop:'2vh'}}>{phone}</span>
                    <a style={{marginTop:'2vh'}} href="mailto:v">contact@909services.com</a>
            </div>
        </div>
    )
}

export default AgencyInfos