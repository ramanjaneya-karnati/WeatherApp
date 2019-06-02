import React, {Component, Fragment} from 'react';
import {Map, GoogleApiWrapper, InfoWindow, Marker} from 'google-maps-react';
import {actions, connect, Provider, subscribe} from './store'
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from "@material-ui/core/Button";
import ErrorModal from './ErrorModal'
import Typography from "@material-ui/core/Typography";
import {withStyles} from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import './App.css'

const mapStyles = {
    width: '100%',
    height: '100%'
};

class MapContainer extends Component {
    constructor() {
        super();
        this.state = {
            maxWidth: 'sm',
            ErrorModalOpen: false
        };
    }


    handleClose = () => {
        actions.changeValue({open: false});
    };
    closeModal = () => {
        this.setState({ErrorModalOpen: false})
        actions.changeValue({isErrorModal: false})
    };
    mapClicked = (mapProps, map, clickEvent, marker) => {

        actions.changeValue({isDataLoading:true});
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

    componentWillReceiveProps(props) {
        if (props.isErrorModal != this.state.ErrorModalOpen)
            this.setState({ErrorModalOpen: props.isErrorModal})
    }

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
        const {WeatherData, open, getCityName, getCountryNameCode, isDataLoading} = this.props;
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
                        <DialogTitle id="form-dialog-title">
                            <Typography variant="h5" component="h2">
                                {getCityName}, {getCountryNameCode}
                            </Typography>
                        </DialogTitle>
                        <DialogContent>
                            <Typography style={{fontSize: 14}} color="textSecondary" gutterBottom>
                                {currentDay} Weather Forecasting
                            </Typography>
                            <Typography style={{fontSize: 14}} color="textSecondary" gutterBottom>
                                {WeatherData.currently.summary}</Typography>
                            <Typography variant="h5" component="h2">
                                Temperature: {WeatherData.currently.temperature} Fº
                            </Typography>
                            <Typography style={{fontSize: 14}} color="textSecondary" gutterBottom>
                                humidity: {WeatherData.currently.humidity}</Typography>
                            <Typography style={{fontSize: 14}} color="textSecondary" gutterBottom>
                                precipIntensity: {WeatherData.currently.precipIntensity}</Typography>
                            <Typography style={{fontSize: 14}} color="textSecondary" gutterBottom>
                                UV: {WeatherData.currently.uvIndex}</Typography>
                            <Typography style={{fontSize: 14}} color="textSecondary" gutterBottom>
                                Wind speed: {WeatherData.currently.windSpeed}</Typography>

                            <Typography style={{fontSize: 14}} color="textSecondary" gutterBottom>
                                {WeatherData.daily.summary}</Typography>

                        </DialogContent>
                        <DialogActions>
                            <Button onClick={this.handleClose} color="primary">
                                Close
                            </Button>

                        </DialogActions>
                    </Dialog>)}
                <ErrorModal
                    openModal={this.state.ErrorModalOpen}
                    closeHandler={this.closeModal}
                />
                {isDataLoading == true && (
                    <div className="overlay-spinner">
                        <CircularProgress className="AppLoader"/>
                    </div>)}
            </Fragment>
        );
    }
}

export default GoogleApiWrapper({
    apiKey: '<Google Api Key>',
})(connect(state => ({...state}))(MapContainer));

