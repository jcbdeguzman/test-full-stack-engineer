import { combineReducers } from 'redux';
import shipReducer from './shipReducer';

export default combineReducers({
    ships: shipReducer
});