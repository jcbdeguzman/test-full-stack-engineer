import { FETCH_SHIPS, FETCH_SHIP_COUNT } from './types';

function checkUndefined(v) {
    return v === undefined ? "":v
}

export function fetchShips(shipType, weight, homePort, limit, offset) {
    return function (dispatch) {
        const url = `http://localhost:4000/getships?ship_type=${checkUndefined(shipType)}&weight_kg=${checkUndefined(weight)}&home_port=${checkUndefined(homePort)}&limit=${checkUndefined(limit)}&offset=${checkUndefined(offset)}`;
        console.log("Request url: ", url);
        fetch(url)
        .then(res => res.json())
        .then(data => {
            dispatch({ type: FETCH_SHIPS, payload: JSON.parse(data.result) });
        })
    }
}

export function fetchShipCount() {
    return function (dispatch) {
        fetch(`http://localhost:4000/getshipcount`)        
        .then(res => res.json())
        .then(data => {
            dispatch({ type: FETCH_SHIP_COUNT, payload: JSON.parse(data['result'])[0]['COUNT(*)'] });
        })
    }
}