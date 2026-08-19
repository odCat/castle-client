import {LOGIN, LOGOUT, UPDATE, VISIT} from "../actions/actions.js";


const initialState = {
    player: {},
};

export function rootReducer(state = initialState, action) {
    switch (action.type) {
        case LOGIN:
        case LOGOUT:
        case UPDATE:
        case VISIT:
            return {
                player: { ...action.payload.player }
            }
        default:
            return state;
    }
}