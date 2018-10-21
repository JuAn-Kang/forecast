import React from 'react'
import './tempSwitcher.css'
const TempSwitcher = props => {
    return <div className={"unit"} onClick={props.clicked}>{props.tempUnit}º</div>
}

export default TempSwitcher