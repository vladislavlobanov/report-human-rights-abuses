import { combineReducers } from "redux";
import draftReducer from "./draftreports/slice.js";
import headlinesReducer from "./headlines/slice.js";
import casesReducer from "./cases/slice.js";

const rootReducer = combineReducers({
    draftReports: draftReducer,
    headlines: headlinesReducer,
    cases: casesReducer,
});

export default rootReducer;
