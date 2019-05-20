import createStore from 'react-waterfall';
import actionsCreators from './actions';

const config = {
    initialState: {
        getMapCoordinates: {},
        getCountryNameCode: {},
        getCityName:{},
        ErrorModalOpen: false,
        WeatherData: {},
        isLoading: true,
        open:false,

    },
    actionsCreators

};
export const {
    Provider,
    connect,
    actions,
    subscribe,
    unsubscribe
} = createStore(config);
