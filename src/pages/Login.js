import React, {useState} from "react";
import {Link, Redirect} from "react-router-dom";
import {useAuth} from "../context/auth";

function Login(props) {
    console.log(props.location)
    const referrer = getReferrer(props.location);

    const [isLoggedIn, setLoggedIn] = useState(false);
    const [isError, setIsError] = useState(false);
    const [mail, setMail] = useState("");
    const [password, setPassword] = useState("");
    const {setAuthTokens} = useAuth();

    async function postLogin(event) {
        event.preventDefault();
        console.log("submit login form");
        const response = await fetch('https://api.rcomanne.nl/user/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "mail": mail,
                "password": password
            })
        }).catch(console.log);
        if (response !== undefined && response.ok) {
            const json = await response.json();

            setAuthTokens(json.jwtToken);
            setLoggedIn(true);
        } else {
            setIsError(true);
        }
    }

    if (isLoggedIn) {
        console.log("Logged in, referring to ", referrer)
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
            {isError && <div className="alert alert-danger" role="alert">Login failed!</div>}
        </div>
    )
}

function getReferrer(location) {
    console.log("Retrieving referrer from location history: ", location)
    if (location.state != null) {
        return location.state.from.pathname;
    } else {
        return '/';
    }
}

export default Login;