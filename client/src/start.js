import ReactDOM from "react-dom";
import { init } from "./socket.js";
import { applyMiddleware, createStore } from "redux";
import thunk from "redux-thunk";
import reducer from "./redux/reducer.js";
import * as immutableState from "redux-immutable-state-invariant";
import { composeWithDevTools } from "redux-devtools-extension";
import { Provider } from "react-redux";
import axios from "axios";
import Welcome from "./welcome";
import App from "./app";

const store = createStore(
    reducer,
    composeWithDevTools(applyMiddleware(immutableState.default(), thunk))
);

axios.get("/user/id.json").then(function ({ data }) {
    if (!data.userId) {
        ReactDOM.render(<Welcome />, document.querySelector("main"));
    } else {
        init(store);
        ReactDOM.render(
            <Provider store={store}>
                <App />
            </Provider>,
            document.querySelector("main")
        );
    }
});
