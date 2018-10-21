import React from 'react'
import Daily from './daily'
import Styles from './daily.module.css'


const DailyList = props => {
    let dl = []
    for (let i in props.data.data){
        dl.push(
            <Daily key={props.data.data[i].time}data={props.data.data[i]}/>
        )
    }

    return (
        <div className={Styles.dailyList}>
            {dl}
        </div>
    )
}
export default DailyList