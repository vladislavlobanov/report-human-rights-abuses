import { combineReducers } from "redux";
import draftReducer from "./draftreports/slice.js";

const rootReducer = combineReducers({
    draftReports: draftReducer,
});

export default rootReducer;
