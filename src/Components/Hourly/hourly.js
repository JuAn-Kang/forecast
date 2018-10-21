import React from 'react'
import Moment from 'moment'
import Styles from './hourly.module.css'
import {smallImages as images} from '../enums'

const Hourly = (props) => {
    return (
        <div className={Styles.hourly}>
            <div className={Styles.cell}>{Moment.unix(props.data.time).format('HH:MM a')}</div>
            <div className={Styles.cell}>
                <img src={images[`${props.data.icon}.png`]} alt={props.data.icon}/>
            </div>
            <div className={Styles.cell}><b>{Math.round(props.data.temperature)}º</b></div>
        </div>
    )
}

export default Hourly