import { Route, Redirect } from "react-router-dom";

const PrivateRoute = ({ component: Component, match: match, ...rest }) => {
    const isValid = () => {
        //axios request
        if (match.params.id == 15) {
            return true;
        } else {
            return false;
        }
    };

    return (
        // Show the component only when the user is logged in
        // Otherwise, redirect the user to /signin page
        <Route
            {...match}
            {...rest}
            render={(props) =>
                isValid() ? <Component {...props} /> : <Redirect to="/draft" />
            }
        />
    );
};

export default PrivateRoute;
