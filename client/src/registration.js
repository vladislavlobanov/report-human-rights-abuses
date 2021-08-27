import { Link } from "react-router-dom";
import { Component } from "react";
import axios from "axios";
import TextField from "@material-ui/core/TextField";

export class Registration extends Component {
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
        axios
            .post("/api/register", this.state)
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
                console.log("something went wrong in POST /register", err);
                this.setState({
                    error: true,
                    errMessage: "Something went wrong",
                });
            });
    }

    render() {
        return (
            <div className="register">
                <div className="regForm">
                    <h1>Registration</h1>
                    {this.state.error && (
                        <h2 style={{ color: "red" }}>
                            {this.state.errMessage}
                        </h2>
                    )}

                    <form className="formRegContainter">
                        <TextField
                            variant="outlined"
                            name="first"
                            label="First name"
                            onChange={this.handleChange}
                            inputProps={{
                                style: {
                                    backgroundColor: "white",
                                },
                            }}
                        />

                        <TextField
                            variant="outlined"
                            name="last"
                            label="Last name"
                            onChange={this.handleChange}
                            inputProps={{
                                style: {
                                    backgroundColor: "white",
                                },
                            }}
                        />

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

                        <TextField
                            variant="outlined"
                            name="password"
                            label="Password"
                            onChange={this.handleChange}
                            inputProps={{
                                style: {
                                    backgroundColor: "white",
                                },
                            }}
                        />
                        <button onClick={(e) => this.handleSubmit(e)}>
                            Register
                        </button>
                    </form>
                    <div>
                        Are you already registered? Click{" "}
                        <Link className="chatName" to="/login">
                            here
                        </Link>{" "}
                        to log in!
                    </div>
                </div>
            </div>
        );
    }
}
