import { BrowserRouter, Route } from "react-router-dom";
import { Registration } from "./registration";
import { Login } from "./login";

export default function Welcome() {
    return (
        <>
            <BrowserRouter>
                <Route exact path="/" component={Registration} />
                <Route path="/login" component={Login} />
            </BrowserRouter>
        </>
    );
}
