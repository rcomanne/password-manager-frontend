import React from "react";
import {NavLink} from "react-router-dom";

function Home() {
    return (
        <div className="container">
            <h2>Home</h2>
            <NavLink className="btn btn-secondary btn-lg btn-block" to="/register">Register</NavLink>
        </div>
    )
}

export default Home;