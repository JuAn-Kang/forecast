import React, { Component } from 'react'
import DarkSkyApi from 'dark-sky-api'
import Axios from 'axios'

import TempSwitcher from './Components/tempSwitcher/tempSwitcher'
import CitySelector from './Components/CitySelector/cityselector'
import Current from './Components/Current/current'
import CurrentDetails from './Components/Current/currentDetails'
import DailyList from './Components/Daily/dailyList'
import HourlyList from './Components/Hourly/hourlyList'



import Tabs from './Layouts/Tabs/tabs'
import {bg} from './Components/enums'



import './App.css'
import loader from './assets/loader/loader.svg'
//import Script from "react-load-script";

class App extends Component {

    constructor(props){
        super(props)

        DarkSkyApi.apiKey = this.API_KEYS.darkSky
        DarkSkyApi.setUnits('si')
        DarkSkyApi.postProcessor = (item) => { // must accept weather data item param

            // add units object onto item
            item.units = DarkSkyApi.getResponseUnits(); // this would be outdated if you changed api units later

            return item; // must return weather data item
        };

        this.state = {
            width: window.innerWidth,
            height: window.innerHeight,
            tempUnit:'C',
            city: "",
            loc: null,
            currentWeather:{
            },
            hourlyWeather:{
            },
            weeklyWeather:{
            },
            timeOfDay:'day',
            allLoaded: false,
        }
    }

    getWindowSize = () =>{
        this.setState({
            width: window.innerWidth,
            height: window.innerHeight
        })
    }

    componentDidMount(){
        this.loadPage()
        window.addEventListener("resize", this.getWindowSize);
    }


    loadPage(){
        //TODO load DarkSkyApi to get current position, pass in the position codes to get address from Geocoding
        DarkSkyApi.loadPosition()
            .then(pos => {
                // console.log("DARK API getPosition: ")
                // console.log(pos)
                this.setState({
                    loc: pos
                })
                return Axios.get(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${pos.latitude},${pos.longitude}&key=${this.API_KEYS.google}`)
            })
            .then(res => {
                //TODO CHECK FOR ANY ERROR CASES, EG: STATE IS !== OK
                //if(res.data.status === OK), do bottom. else, display error message.
                // console.log("res inside Axios google call: ")
                // console.log(res)
                if(res.data.status === "OK") {
                    this.setState({
                        city: res.data.results[0].address_components.filter((arr) => arr.types.includes("locality") || arr.types.includes("sublocality"))[0].long_name
                    })
                }
                else{ //if status of Google API !== OK
                    this.setState({
                        city: "Error fetching data"
                    })
                }

                //Dark Sky: Fetch data
                return DarkSkyApi.loadItAll('',this.state.loc)
            })
            .then(res => {
                // console.log("Dark API Weather call")
                // console.log(res)
                res.hourly.data = res.hourly.data.slice(24)
                this.setState({
                    tempUnit: res.flags.units === 'us' ? "F" : "C",
                    loc: {latitude: res.latitude,
                        longitude: res.longitude},
                    currentWeather: res.currently,
                    hourlyWeather:res.hourly,
                    weeklyWeather:res.daily,
                    timeOfDay: ((res.currently.time > res.daily.data[0].sunsetTime) || (res.currently.time < res.daily.data[0].sunriseTime)) ? 'night' : 'day'
                })
            })
            .then(() => {this.setState({allLoaded:true})})
    }
  API_KEYS= {
      google: process.env.REACT_APP_GOOGLE_PLACES_API_KEY,
      darkSky: process.env.REACT_APP_DARK_SKY_API_KEY
  }


    scriptErrorHandler = () =>{
        this.setState({ scriptError: true })
    }

    scriptLoadHandler = () =>{
        // Declare Options For Autocomplete

        var options = { types: ['geocode'] };

        // Initialize Google Autocomplete
        /*global google*/
        this.autocomplete = new google.maps.places.Autocomplete(
            document.getElementById('autocomplete'),
            options );
        // Fire Event when a suggested name is selected
        this.autocomplete.addListener('place_changed',
            this.handlePlaceSelect);
    }

    handlePlaceSelect = () => {

        // Address -> City, latlng
        let addressObject = this.autocomplete.getPlace();
        let address = addressObject.address_components;

        // Check if address is valid
        if (address) {
            // Set State
            // console.log("ADDRESS: ")
            // console.log(address)
            this.setState(
                {
                    //Return city name
                    city: address.filter((arr) => arr.types.includes("locality") || arr.types.includes("sublocality") ||arr.types.includes("political"))[0].long_name,
                    loc: {latitude: addressObject.geometry.location.lat(),
                        longitude: addressObject.geometry.location.lng()}
                }
            );
            this.updateWeather()
        }
    }

    updateWeather(){
        DarkSkyApi.loadItAll('',this.state.loc)
            .then(res => {
                // console.log("Dark API Weather call")
                // console.log(res)
                res.hourly.data = res.hourly.data.slice(24)
                this.setState({
                    loc: {latitude: res.latitude,
                        longitude: res.longitude},
                    currentWeather: res.currently,
                    hourlyWeather:res.hourly,
                    weeklyWeather:res.daily,
                    timeOfDay: res.currently.time > res.daily.data[0].sunsetTime ? 'night' : 'day',
                    allLoaded:true
                })
            })
    }
    cityChangeHandler = (event) => {
      this.setState({
          city: event.target.value
        })
    }

    getLocation = () => {
        this.loadPage()
    }

    toggleUnit = () =>{
        const unit = (this.state.tempUnit === "C") ? "F" : "C"
        const unitapi = (this.state.tempUnit === "C") ? "us" : "si"
        this.setState({
            tempUnit: unit
        })
        DarkSkyApi.setUnits(unitapi)
        this.updateWeather()
       //this.forceUpdate()
    }
  render() {
    //set background
    document.body.style.backgroundColor = bg[this.state.timeOfDay][this.state.currentWeather.icon]
    if(!this.state.allLoaded){
        return(<div>
            <TempSwitcher
                tempUnit={this.state.tempUnit}
                clicked={this.toggleUnit}
            />
            <CitySelector
                apikey={this.API_KEYS.google}
                city={this.state.city}
                error={this.scriptErrorHandler}
                loaded={this.scriptLoadHandler}
                changed={this.cityChangeHandler}
                clicked={this.getLocation}
            />
            <div className={"loader-container"}>
                <img src={loader} />
            </div>
        </div>)
    }
    else {
        //Tabbed Layout for Mobile components
        if (this.state.width < this.state.height)
            return (
                <div>
                    {/*<img id="loader"  src={loader} />*/}
                    <TempSwitcher
                        tempUnit={this.state.tempUnit}
                        clicked={this.toggleUnit}
                    />
                    <CitySelector
                        apikey={this.API_KEYS.google}
                        city={this.state.city}
                        error={this.scriptErrorHandler}
                        loaded={this.scriptLoadHandler}
                        changed={this.cityChangeHandler}
                        clicked={this.getLocation}
                    />
                    <Current
                        data={this.state.currentWeather}
                        unit={this.state.tempUnit}
                    />
                    <Tabs>
                        <div label="Now">
                            <CurrentDetails
                                data={this.state.currentWeather}
                                unit={this.state.tempUnit}
                            />
                        </div>
                        <div label="Today">
                            <HourlyList
                                data={this.state.hourlyWeather}
                            />
                        </div>
                        <div label="This Week">
                            <DailyList
                                data={this.state.weeklyWeather}
                            />
                        </div>
                    </Tabs>
                </div>
            )
        else if (this.state.width < 1024 && (this.state.width > this.state.height))
            return (
                <div className={"tablet-sm-container"}>
                    <TempSwitcher
                        tempUnit={this.state.tempUnit}
                        clicked={this.toggleUnit}
                    />
                    <div className={"column"}>
                        <CitySelector
                            apikey={this.API_KEYS.google}
                            city={this.state.city}
                            error={this.scriptErrorHandler}
                            loaded={this.scriptLoadHandler}
                            changed={this.cityChangeHandler}
                            clicked={this.getLocation}
                        />
                        <Current
                            data={this.state.currentWeather}
                            unit={this.state.tempUnit}
                        />
                    </div>

                    <div className={"column"}>
                        <Tabs>
                            <div label="Now">
                                <CurrentDetails
                                    data={this.state.currentWeather}
                                    unit={this.state.tempUnit}
                                />
                            </div>
                            <div label="Today">
                                <HourlyList
                                    data={this.state.hourlyWeather}
                                />
                            </div>
                            <div label="This Week">

                                <DailyList
                                    data={this.state.weeklyWeather}
                                />
                            </div>
                        </Tabs>
                    </div>
                </div>
            )
        else
            return (

                <div className={"tablet-container"}>
                    <TempSwitcher
                        tempUnit={this.state.tempUnit}
                        clicked={this.toggleUnit}
                    />
                    <div className={"column"}>
                        <CitySelector
                            apikey={this.API_KEYS.google}
                            city={this.state.city}
                            error={this.scriptErrorHandler}
                            loaded={this.scriptLoadHandler}
                            changed={this.cityChangeHandler}
                            clicked={this.getLocation}
                        />
                        <Current
                            data={this.state.currentWeather}
                        />
                        <CurrentDetails
                            data={this.state.currentWeather}
                        />
                    </div>
                    <div className={"column"}>
                        <h1>Today</h1>
                        <HourlyList
                            data={this.state.hourlyWeather}
                        />
                        <h1>This Week</h1>
                        <DailyList
                            data={this.state.weeklyWeather}
                        />
                    </div>
                </div>
            )
    }
  }
}

export default App;
