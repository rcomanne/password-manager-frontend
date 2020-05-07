import React, {useState} from "react";
import {Link, Redirect} from "react-router-dom";
import {useAuth} from "../context/auth";

function Activate() {
    const api = 'https://api.rcomanne.nl'

    const [isError, setIsError] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [mail, setMail] = useState("");
    const [isLoggedIn, setLoggedIn] = useState(false);
    const [activationToken, setActivationToken] = useState("");
    const {setAuthTokens} = useAuth();

    async function postActivationToken(event) {
        event.preventDefault();
        const response = await fetch(api + '/user/activate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                'activationToken': activationToken,
                'mail': mail
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
        return <Redirect to="/passwords"/>
    }

    return (
        <div className="container">
            <form onSubmit={postActivationToken}>
                <h2>Activate your account</h2>
                <div className="form-group">
                    <label htmlFor="activationEmail">Email address</label>
                    <input id="mail" type="email" value={mail} className="form-control" required={true}
                           placeholder="Enter email" onChange={e => {
                        setMail(e.target.value);
                    }}/>
                </div>
                <div className="form-group">
                    <label htmlFor="activationToken">Activation token</label>
                    <input id="activationToken" type="text" className="form-control" required={true} placeholder="Enter activation token" onChange={e => {
                        setActivationToken(e.target.value);
                    }}/>
                </div>
                <input type="submit" className="btn btn-primary" value="Submit"/>
            </form>
            <Link to="/login">Already have an <b>activated</b> account?</Link>
            { isError && <div className="alert alert-danger" role="alert">{errorMessage}</div> }
        </div>
    )
}

export default Activate;