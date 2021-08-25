import { combineReducers } from "redux";
import draftReducer from "./draftreports/slice.js";
import headlinesReducer from "./headlines/slice.js";

const rootReducer = combineReducers({
    draftReports: draftReducer,
    headlines: headlinesReducer,
});

export default rootReducer;
