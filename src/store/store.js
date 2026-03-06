import {configureStore} from "@reduxjs/toolkit"
import {rootReducer} from "./reducers/reducers.js";


export default configureStore({
    reducer: rootReducer
})