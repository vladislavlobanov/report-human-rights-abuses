import { Component } from "react";
import { BrowserRouter } from "react-router-dom";
import Report from "./report";
import axios from "axios";

export default class App extends Component {
    constructor() {
        super();
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
                    <h1>App component</h1>
                    <Report />
                </>
            </BrowserRouter>
        );
    }
}
