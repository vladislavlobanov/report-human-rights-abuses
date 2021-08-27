import { Component } from "react";
import { BrowserRouter, Route } from "react-router-dom";
import Report from "./report";
import axios from "axios";
import "mapbox-gl/dist/mapbox-gl.css";
import SendDrafts from "./senddrafts";
import CaseProfile from "./caseProfile";
import Feed from "./feed";
import Search from "./search";

export default class App extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    async componentDidMount() {
        try {
            const resp = await axios.get("/user");

            if (resp.data.success) {
                this.setState({
                    first: resp.data.first,
                    last: resp.data.last,
                    userId: resp.data.userId,
                    url: this.props.match,
                });
            }
        } catch (err) {
            console.log("Err in axios get /user: ", err);
        }
    }

    render() {
        return (
            <BrowserRouter>
                <>
                    <h1>UNHEARD VOICES</h1>
                    <Route exact path="/" component={Feed} />
                    <Route exact path="/search" component={Search} />
                    <Route
                        path="/draft"
                        render={(props) => (
                            <Report
                                key={props.match.url}
                                match={props.match}
                                history={props.history}
                            />
                        )}
                    />

                    <Route
                        path="/case/:id"
                        render={(props) => (
                            <CaseProfile
                                key={props.match.url}
                                match={props.match}
                                history={props.history}
                            />
                        )}
                    />
                    <Route path="/finalize">
                        <SendDrafts userId={this.state.userId} />
                    </Route>
                </>
            </BrowserRouter>
        );
    }
}
