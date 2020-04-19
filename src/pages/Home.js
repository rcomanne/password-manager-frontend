import React from "react";
import {useAuth} from "../context/auth";
import {Link} from "react-router-dom";

function Home() {
    const {setAuthTokens} = useAuth();

    function logOut() {
        setAuthTokens();
    }

    return (
        <div className="container">
            <h2>Home</h2>
            <button className="btn btn-primary btn-lg btn-block" onClick={logOut}>Log out</button>
            <Link to="/login">
                <button className="btn btn-primary btn-lg btn-block">Log in</button>
            </Link>
            <Link to="/register">
                <button className="btn btn-secondary btn-lg btn-block">Register</button>
            </Link>
        </div>
    )
}

export default Home;