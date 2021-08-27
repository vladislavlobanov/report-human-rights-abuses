import { Component } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

export class ResetPassword extends Component {
    constructor() {
        super();
        this.state = {
            error: false,
            errMessage: "",
            view: 3,
        };
        this.handleChange = this.handleChange.bind(this);
    }
    handleChange({ target }) {
        console.log("which input is running handleChange?", target.name);
        console.log("value the user typed:", target.value);
        // updating state!
        this.setState(
            {
                [target.name]: target.value,
            },
            console.log("this.state in ResetPwd:", this.state)
        );
    }
    handleSubmit(e) {
        e.preventDefault(); // prevents button from triggering a refresh
        console.log("user clicked ResetPwd");
        // when the btn gets clicked we want to make an axios request sending
        // over our value of state
        console.log("this.state in ResetPwd", this.state);

        if (this.state.view == 1) {
            axios
                .post("/api/password/reset/start", this.state)
                .then((resp) => {
                    if (resp.data.success) {
                        this.setState({
                            view: this.state.view + 1,
                            error: false,
                            errMessage: "",
                        });
                    } else {
                        this.setState({
                            error: true,
                            errMessage: resp.data.errMessage,
                        });
                    }
                })
                .catch((err) => {
                    console.log(
                        "something went wrong in POST /password/reset/start",
                        err
                    );
                    this.setState({
                        error: true,
                        errMessage: "Something went wrong",
                    });
                });
        }

        if (this.state.view == 2) {
            axios
                .post("/api/password/reset/verify", this.state)
                .then((resp) => {
                    if (resp.data.success) {
                        this.setState({
                            view: this.state.view + 1,
                            error: false,
                            errMessage: "",
                        });
                    } else {
                        this.setState({
                            error: true,
                            errMessage: resp.data.errMessage,
                        });
                    }
                })
                .catch((err) => {
                    console.log(
                        "something went wrong in POST /password/reset/verify",
                        err
                    );
                    this.setState({
                        error: true,
                        errMessage: "Something went wrong",
                    });
                });
        }
    }
    componentDidMount() {
        console.log("ResetPwd just mounted");
    }

    determineViewToRender() {
        // this method determines what the render!
        if (this.state.view === 1) {
            return (
                <div className="register">
                    <div className="regForm">
                        <h1>Reset Password</h1>
                        {this.state.error && (
                            <h2 style={{ color: "red" }}>
                                {this.state.errMessage}
                            </h2>
                        )}
                        <section>
                            <form className="formRegContainter">
                                <div>
                                    Please provide the email address with which
                                    you registered
                                </div>

                                <label htmlFor="email">Email</label>
                                <input
                                    name="email"
                                    onChange={this.handleChange}
                                    key="email"
                                />

                                <button onClick={(e) => this.handleSubmit(e)}>
                                    Submit
                                </button>
                            </form>
                        </section>
                    </div>
                </div>
            );
        } else if (this.state.view === 2) {
            return (
                <div className="register">
                    <div className="regForm">
                        <h1>Reset Password</h1>
                        {this.state.error && (
                            <h2 style={{ color: "red" }}>
                                {this.state.errMessage}
                            </h2>
                        )}
                        <section>
                            <form className="formRegContainter">
                                <div>Please enter the code you received</div>

                                <label htmlFor="code">Code</label>
                                <input
                                    name="code"
                                    onChange={this.handleChange}
                                    key="code"
                                />

                                <div>Please enter a new password</div>

                                <label htmlFor="password">Password</label>
                                <input
                                    type="password"
                                    name="password"
                                    onChange={this.handleChange}
                                    key="password"
                                />

                                <button onClick={(e) => this.handleSubmit(e)}>
                                    Submit
                                </button>
                            </form>
                        </section>
                    </div>
                </div>
            );
        } else if (this.state.view === 3) {
            return (
                <div className="register">
                    <div className="regForm">
                        <h1>Success!</h1>
                        <div>
                            You can now{" "}
                            <Link className="chatName" to="/login">
                                log in
                            </Link>{" "}
                            with your new password
                        </div>
                    </div>
                </div>
            );
        }
    }

    render() {
        return <>{this.determineViewToRender()}</>;
    }
}
