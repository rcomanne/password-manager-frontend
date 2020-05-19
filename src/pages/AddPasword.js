import React, {useState} from "react";
import {useAuth} from "../context/auth";
import {Redirect} from "react-router-dom";
import GeneratePassword from "../components/GeneratePassword";

function AddPassword() {
    const api = 'https://api.rcomanne.nl'

    const {authTokens} = useAuth();

    const [isError, setIsError] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [isSucceeded, setIsSucceeded] = useState(false);
    const [succeededMessage, setSucceededMessage] = useState("");
    const [name, setName] = useState('');
    const [domain, setDomain] = useState('');
    const [password, setPassword] = useState('');

    async function postPassword(event) {
        event.preventDefault();
        const response = await fetch(api + '/pw/add', {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + authTokens,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                passwords: [
                    {
                        "name": name,
                        "domain": domain,
                        "password": password
                    }
                ]
            })
        }).catch(console.log);

        if (response !== undefined) {
            const json = await response.json()
            if (response.ok) {
                setIsSucceeded(true);
                setSucceededMessage("Added password!")
            } else {
                setErrorMessage(json.message);
                setIsError(true);
            }
        } else {
            setErrorMessage("Failed to connect to the service.");
            setIsError(true);
        }
    }

    if (isSucceeded) {
        return <Redirect to="/passwords"/>
    }

    return (
        <div className="container-lg">
            <div className="row justify-content-center">
                <GeneratePassword/>
            </div>
            {isSucceeded && <div className="row"><div className="alert alert-success" role="alert">{succeededMessage}</div></div>}
            <div className="row justify-content-center">
                <div className="col">
                    <form onSubmit={postPassword}>
                        <div className="form-group">
                            <label htmlFor="addDomain">Domain/Service/Website</label>
                            <input id="domain" type="text" value={domain} className="form-control" required={true}
                                   placeholder="Domain" onChange={e => {
                                setDomain(e.target.value);
                            }}/>
                        </div>
                        <div className="form-group">
                            <label htmlFor="addName">Username/email</label>
                            <input id="name" type="text" value={name} className="form-control" required={true}
                                   placeholder="Username/email" onChange={e => {
                                setName(e.target.value);
                            }}/>
                        </div>
                        <div className="form-group">
                            <label htmlFor="addPassword">Password</label>
                            <input id="password" type="password" value={password} className="form-control"
                                   required={true}
                                   placeholder="Password" onChange={e => {
                                setPassword(e.target.value);
                            }}/>
                        </div>
                        <input type="submit" className="btn btn-primary" value="Submit"/>
                    </form>
                    {isError && <div className="alert alert-danger" role="alert">{errorMessage}</div>}
                </div>
            </div>
        </div>
    )
}

export default AddPassword;