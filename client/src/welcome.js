import { BrowserRouter, Route } from "react-router-dom";
import { Registration } from "./registration";
import { Login } from "./login";
import { ResetPassword } from "./resetpassword";
import { Link } from "react-router-dom";

export default function Welcome() {
    return (
        <>
            <BrowserRouter>
                <header>
                    <div className="logo">
                        <Link to="/">
                            <h1>UNHEARD VOICES</h1>
                        </Link>
                    </div>
                    <div className="headerRight"></div>
                </header>
                <div className="belowHeaderCont">
                    <Route exact path="/" component={Registration} />
                    <Route path="/login" component={Login} />
                    <Route path="/password-reset" component={ResetPassword} />
                </div>
            </BrowserRouter>
        </>
    );
}
