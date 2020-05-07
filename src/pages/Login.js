import React, {useState} from "react";
import {Link, Redirect} from "react-router-dom";
import {useAuth} from "../context/auth";

function Login(props) {
    const referrer = getReferrer(props.location);
    const api = 'https://api.rcomanne.nl'

    const [isLoggedIn, setLoggedIn] = useState(false);
    const [isError, setIsError] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [mail, setMail] = useState("");
    const [password, setPassword] = useState("");
    const {setAuthTokens} = useAuth();

    async function postLogin(event) {
        event.preventDefault();
        const url = api + '/user/login'
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "mail": mail,
                "password": password
            })
        }).catch(console.log);

        if (response === undefined) {
            setIsError(true);
            setErrorMessage("Could not get a response from the service.")
        } else if (response.ok) {
            const json = await response.json();
            setAuthTokens(json.jwtToken);
            setLoggedIn(true);
        } else {
            const json = await response.json();
            setErrorMessage(json.message);
            setIsError(true);
        }
    }

    if (isLoggedIn) {
        return <Redirect to={referrer}/>
    }

    return (
        <div className="container">
            <form onSubmit={postLogin}>
                <div className="form-group">
                    <label htmlFor="loginEmail">Email address</label>
                    <input id="mail" type="email" value={mail} className="form-control" required={true}
                           placeholder="Enter email" onChange={e => {
                        setMail(e.target.value);
                    }}/>
                </div>
                <div className="form-group">
                    <label htmlFor="loginPassword">Password</label>
                    <input id="password" type="password" value={password} className="form-control" required={true}
                           placeholder="Password" onChange={e => {
                        setPassword(e.target.value);
                    }}/>
                </div>
                <input type="submit" className="btn btn-primary" value="Submit"/>
            </form>
            <Link to="/register">Don't have an account?</Link>
            {isError && <div className="alert alert-danger" role="alert">{errorMessage}</div>}
        </div>
    )
}

function getReferrer(location) {
    if (location.state != null) {
        return location.state.from.pathname;
    } else {
        return '/';
    }
}

export default Login;