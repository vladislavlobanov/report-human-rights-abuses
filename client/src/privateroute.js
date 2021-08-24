import { Route, Redirect } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";

const PrivateRoute = ({ component: Component, match: match, ...rest }) => {
    const [isValid, setValid] = useState(null);

    useEffect(async () => {
        const { data } = await axios.get("/checklink/", {
            params: { id: match.params.id },
        });

        if (data.success == true) {
            setValid(true);
        } else {
            setValid(false);
        }
    }, []);

    // const isValid = () => {
    // const { data } = await axios.get("/checklink/", {
    //     params: { id: match.params.id },
    // });

    // if (data.success == true) {
    //     return true;
    // } else {
    //     return false;
    // }
    // };

    if (!isValid) {
        return null;
    }

    return (
        <Route
            {...match}
            {...rest}
            render={(props) =>
                isValid ? <Component {...props} /> : <Redirect to="/draft" />
            }
        />
    );
};

export default PrivateRoute;
