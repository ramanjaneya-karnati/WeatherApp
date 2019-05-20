/* eslint-disable */
const getCountry = (addrComponents) => {
    for (let i = 0; i < addrComponents.length; i++) {
        if (addrComponents[i].types[0] == "country") {
            return addrComponents[i].address_components[0].short_name;
        }
    }
    return false;
};

const actionsCreators = {

    changeValue: (state, actions, value) => {
        return {...value};
    },
    updateState: (state, actions, payload) => {
        return payload;
    },
    getCountryName: (state, actions) => {
        const URL = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${state.getMapCoordinates.lat},${state.getMapCoordinates.lng}&sensor=true&key=AIzaSyCATdmw8Riy4SSzZkJSvr6Ku4WNHDHIr8g`;
        fetch(URL).then(response => {
            return response.json();
        })
            .then(data => {
                if (data.status !== 'OK') {
                    throw new Error();
                } else {
                    const countryShortCode = getCountry(data.results);
                    console.log("Country Code", countryShortCode);
                    actions.changeValue({getCountryNameCode: countryShortCode})
                    fetch(`https://restcountries-v1.p.rapidapi.com/alpha/?codes=${countryShortCode}`, {
                        headers: {
                            "X-RapidAPI-Key": "93985db288msha86fe9228512799p17dd9djsna42cabb64978"
                        }
                    })
                        .then(response => {
                            return response.json();
                        })
                        .then(resData => {
                            console.log("COUNTRY CAPITAL", resData[0].capital);
                            actions.changeValue({getCityName:resData[0].capital})
                            if (resData[0].capital !== null) {
                                const CITYLATLNG = `https://maps.googleapis.com/maps/api/geocode/json?address=${resData[0].capital}&key=AIzaSyCATdmw8Riy4SSzZkJSvr6Ku4WNHDHIr8g`
                                fetch(CITYLATLNG)
                                    .then(response => {
                                        return response.json();
                                    })
                                    .then(resData => {
                                        const BACKEND_URL = process.env.BACKEND_URL;
                                        console.log("CITY COORDINATES", resData.results[0].geometry.location);
                                        const weatherData = `http://localhost:8080/weather/api/fetch-weather?lat=${resData.results[0].geometry.location.lat}&long=${resData.results[0].geometry.location.lng}`
                                        if (resData.results[0].geometry.location !== null) {
                                            fetch(weatherData)
                                                .then(response => {
                                                    return response.json();
                                                })
                                                .then(resDataWeather => {
                                                    console.log("ACTIONS", actions);
                                                    console.log("API DATA", resDataWeather);
                                                    if (resDataWeather.status  == "SUCCESS") {
                                                        actions.changeValue({ WeatherData: resDataWeather.data, open:true})

                                                    } else {
                                                        actions.changeValue({ErrorModalOpen: true})

                                                    }
                                                })


                                        }
                                    });
                            }
                        })
                }
            })
            .catch(err =>
                actions.changeValue({ErrorModalOpen: true, isLoading: false})
            );
        return {}

    },
};

export default actionsCreators;

