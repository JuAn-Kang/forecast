import React from 'react'
import Moment from 'moment'
import Styles from './daily.module.css'
import {smallImages as images} from '../enums'

const Daily = (props) => {

    return (
        <div className={Styles.daily}>
            <div className={Styles.cell}>{Moment(props.data.dateTime).calendar(null, {
                sameDay: '[Today]',
                nextDay: '[Tomorrow]',
                nextWeek: 'ddd, Do',
                lastDay: '[Yesterday]',
                lastWeek: '[Last] dddd',
                sameElse: 'ddd, Do'
            })}</div>
            <div  className={Styles.cell}>
                <img src={images[`${props.data.icon}.png`]} alt={props.data.icon}/>
            </div>
            <div className={Styles.cell}><b>{Math.round(props.data.temperatureHigh)}º</b>/{Math.round(props.data.temperatureLow)}º</div>
        </div>
    )
}

export default Daily