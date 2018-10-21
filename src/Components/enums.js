export const bg = {
    day:{
        "clear-day": "#56C1FF",
        "rain": "#CCCCCC",
        "snow": "#D8E8F8",
        "sleet": "#CCCCCC",
        "fog": "#DDDDDD",
        "cloudy": "#B2CFE3",
        "wind" : "#B2CFE3",
        "partly-cloudy-day": "#B2CFE3",
        "hail": "#CCCCCC",
        "thunderstorm": "#AAAAAA",
        "tornado": "#AAAAAA"

    },
    night:{
        "clear-night": "#3E4C90",
        "rain": "#555555",
        "snow": "#504787",
        "sleet": "#555555",
        "fog": "#564E5F",
        "cloudy": "#6C679A",
        "wind": "#6C679A",
        "partly-cloudy-night": "#6C679A",
        "hail": "#555555",
        "thunderstorm": "#333333",
        "tornado": "#333333"
    }
}

function importAll(r) {
    let images = {}
    //r.keys().map((item, index) => { images[item.replace('./', '')] = r(item); });
    r.keys().map((item) =>  images[item.replace('./', '')] = r(item) );
    return images
}

export const mainImages = importAll(require.context('../assets/weather-lg', false, /\.(png|jpe?g|svg)$/));
export const smallImages = importAll(require.context('../assets/weather-sm', false, /\.(png|jpe?g|svg)$/));