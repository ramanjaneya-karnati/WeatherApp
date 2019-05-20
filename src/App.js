import React, {Component, Fragment} from 'react';
import {Map, GoogleApiWrapper, InfoWindow, Marker} from 'google-maps-react';
import {actions, connect, Provider, subscribe} from './store'
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from "@material-ui/core/Button";

const mapStyles = {
    width: '100%',
    height: '100%'
};

class MapContainer extends Component {
    state = {
        maxWidth: 'sm'
    };


    handleClose = () => {
        actions.changeValue({open: false});
    };
    mapClicked = (mapProps, map, clickEvent, marker) => {


        const lat = clickEvent.latLng.lat().toFixed(3);
        const lng = clickEvent.latLng.lng().toFixed(3);
        if (lat && lng !== null) {
            actions.changeValue({
                getMapCoordinates: {
                    lat: lat,
                    lng: lng
                }
            });
            actions.getCountryName();
        }
    };

    render() {
        let d = new Date();
        let weekday = new Array(7);
        weekday[0] = "Sunday";
        weekday[1] = "Monday";
        weekday[2] = "Tuesday";
        weekday[3] = "Wednesday";
        weekday[4] = "Thursday";
        weekday[5] = "Friday";
        weekday[6] = "Saturday";

        let currentDay = weekday[d.getDay()];
        const {WeatherData, open, getCityName, getCountryNameCode} = this.props;
        console.log("THIS PROPS", this.props);
        return (
            <Fragment>
                <Map
                    google={this.props.google}
                    zoom={2}
                    style={mapStyles}
                    initialCenter={{
                        lat: -1.2884,
                        lng: 36.8233
                    }}
                    gestureHandling='none'
                    zoomControl={false}
                    scaleControl={false}
                    scrollwheel={false}
                    disableDoubleClickZoom={true}
                    onClick={this.mapClicked}
                >

                </Map>
                {open == true && (
                    <Dialog
                        fullWidth={true}
                        maxWidth={this.state.maxWidth}
                        open={open}
                        onClose={this.handleClose}
                        aria-labelledby="form-dialog-title"
                    >
                        <DialogTitle id="form-dialog-title">{getCityName}, {getCountryNameCode}</DialogTitle>
                        <DialogContent>
                            <DialogContentText >
                                <p>{currentDay}</p>
                                <p>{WeatherData.currently.summary}</p>
                                <h1>{WeatherData.currently.temperature} Fº</h1>
                            </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={this.handleClose} color="primary">
                                Cancel
                            </Button>

                        </DialogActions>
                    </Dialog>)}

            </Fragment>
        );
    }
}

export default GoogleApiWrapper({
    apiKey: 'AIzaSyCATdmw8Riy4SSzZkJSvr6Ku4WNHDHIr8g',
})(connect(state => ({...state}))(MapContainer));

