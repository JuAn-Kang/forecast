import React from 'react'
import Script from 'react-load-script'
import PropTypes from 'prop-types'

import Styles from './cityselector.module.css'

import locationIcon from '../../assets/misc/location.png'

const CitySelector = (props) => {
    return(
        <div className={Styles.loc}>
            <Script
                url={`https://maps.googleapis.com/maps/api/js?key=${props.apikey}&libraries=places`}
                onError={props.error}
                onLoad={props.loaded}
            />
            <input
                id="autocomplete"
                type="text"
                value={props.city}
                onChange={props.changed}/>
            <img alt="locate" src={locationIcon} height="15px" onClick={props.clicked}/>
        </div>
    )
}

CitySelector.propTypes = {
    apikey:PropTypes.string,
    error:PropTypes.func,
    loaded:PropTypes.func,
    city:PropTypes.string,
    changed:PropTypes.func,
    clicked:PropTypes.func
}

export default CitySelector