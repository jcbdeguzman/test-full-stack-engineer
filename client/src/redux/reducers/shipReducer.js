import { FETCH_SHIPS, FETCH_SHIP_COUNT } from '../actions/types';

const initialState = {
    shipList: [],
    shipCount: 0
}

export default function(state = initialState, action) {
    switch(action.type) {
        case FETCH_SHIPS:
            return {
                ...state,
                shipList: action.payload
            }
        case FETCH_SHIP_COUNT:
            return {
                ...state,
                shipCount: action.payload
            }
        default:
            return state;
    }
}