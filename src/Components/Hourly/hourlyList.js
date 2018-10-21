import React from 'react'
import Hourly from './hourly'
import Styles from './hourly.module.css'


const HourlyList = props => {

    let hl = []
    for (let i in props.data.data){
        hl.push(
            <Hourly key={props.data.data[i].time} data={props.data.data[i]}/>
        )
    }

   // const hours = props.data.data ? props.data.data.map( (hour) => {return <Hourly key={hour.index.time} data={hour.index}/>}) : null
    return (
        <div className={Styles.scroll}>
        <div className={Styles.hourlyList} >
            {hl}
        </div>
        </div>
    )
}
export default HourlyList