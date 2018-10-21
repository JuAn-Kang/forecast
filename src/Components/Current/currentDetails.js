import React from 'react'
import Styles from './current.module.css'

const CurrentDetails = (props) => {
    //item.day = item.dateTime.format('ddd');
    //   return item;
    return (
        <div className={Styles.detail}>
            <div className={Styles.summary}>{props.data.summary}.</div>
            <div className={Styles.feature}>{props.data.day}</div>
            <div className={Styles.feature}>
                Chance of rain: {props.data.precipProbability * 100}%
            </div>
            <div className={Styles.feature}>
                Humidity: {props.data.humidity}
                </div>
            <div className={Styles.feature}>
                Wind: {props.data.windDirection}º {props.data.windSpeed} m/s
                </div>
            <div className={Styles.feature}>
                UV Index: {props.data.uvIndex}
                </div>
            <div className={Styles.feature}>
                Pressure: {props.data.pressure} hPa
            </div>
        </div>
    )
}

export default CurrentDetails