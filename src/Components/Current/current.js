import React from 'react'
import{mainImages as images} from '../enums'
import Styles from './current.module.css'


const Current = (props) => {
    return(
        <div className={Styles.main}>
            <img src={images[`${props.data.icon}.png`]} alt={props.data.icon}/>
            <div className={Styles.centered}>&ensp;{`${Math.round(props.data.temperature) || "..."}º`}</div>
        </div>
    )
}
export default Current