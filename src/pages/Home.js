import React from "react";
import {NavLink} from "react-router-dom";
import GeneratePassword from "../components/GeneratePassword";

function Home() {
    return (
        <div className="container-lg">
            <div className="row">
                <div className="col">
                    <h2>Home</h2>
                </div>
            </div>
            <div className="row">
                <div className="col">
                    <GeneratePassword/>
                </div>
            </div>
            <div className="row">
                <div className="col">
                    <NavLink className="btn btn-primary btn-lg btn-block" to="/login">Login</NavLink>
                </div>
                <div className="col">
                    <NavLink className="btn btn-secondary btn-lg btn-block" to="/register">Register</NavLink>
                </div>
            </div>
        </div>
    )
}

export default Home;