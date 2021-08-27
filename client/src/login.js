import { Component } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import TextField from "@material-ui/core/TextField";

export class Login extends Component {
    constructor() {
        super();
        this.state = {
            error: false,
            errMessage: "",
        };
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange({ target }) {
        this.setState({
            [target.name]: target.value,
        });
    }

    handleSubmit(e) {
        e.preventDefault();
        console.log("this.state in login", this.state);
        axios
            .post("/api/login", this.state)
            .then((resp) => {
                if (resp.data.success) {
                    location.replace("/");
                } else {
                    this.setState({
                        error: true,
                        errMessage: resp.data.errMessage,
                    });
                }
            })
            .catch((err) => {
                console.log("something went wrong in POST /login", err);
                this.setState({
                    error: true,
                    errMessage: "Something went wrong",
                });
            });
    }

    render() {
        return (
            <div className="mainCon">
                <div className="mainConBack">
                    <div className="register">
                        <div className="regForm">
                            <h1>Log in</h1>
                            {this.state.error && (
                                <h2 style={{ color: "red" }}>
                                    {this.state.errMessage}
                                </h2>
                            )}
                            <form className="formRegContainter">
                                {/* <label htmlFor="email">Email</label>
                        <input name="email" onChange={this.handleChange} /> */}

                                <TextField
                                    variant="outlined"
                                    name="email"
                                    label="Email"
                                    onChange={this.handleChange}
                                    inputProps={{
                                        style: {
                                            backgroundColor: "white",
                                        },
                                    }}
                                />

                                {/* <label htmlFor="password" onChange={this.handleChange}>
                            Password
                        </label>
                        <input
                            type="password"
                            name="password"
                            onChange={this.handleChange}
                        /> */}
                                <TextField
                                    variant="outlined"
                                    name="password"
                                    label="Password"
                                    type="password"
                                    inputProps={{
                                        style: {
                                            backgroundColor: "white",
                                        },
                                    }}
                                    onChange={this.handleChange}
                                />
                                <button onClick={(e) => this.handleSubmit(e)}>
                                    Log in
                                </button>
                            </form>
                            <div>
                                Forgot your password? Reset your password{" "}
                                <Link className="chatName" to="/password-reset">
                                    here
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
