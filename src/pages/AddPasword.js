import React, {useState} from "react";
import {useAuth} from "../context/auth";
import {Redirect} from "react-router-dom";

function AddPassword() {
    const { authTokens } = useAuth();

    const [isError, setIsError] = useState(false);
    const [name, setName] = useState('');
    const [domain, setDomain] = useState('');
    const [password, setPassword] = useState('');

    async function postPassword(event) {
        event.preventDefault();
        console.log("submit password");
        const response = await fetch('https://api.rcomanne.nl/pw/add', {
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
        if (response !== undefined && response.ok) {
            return <Redirect to="/passwords"/>
        } else {
            setIsError(true);
        }
    }

    return (
        <div className="container">
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
                    <input id="password" type="password" value={password} className="form-control" required={true}
                           placeholder="Password" onChange={e => {
                        setPassword(e.target.value);
                    }}/>
                </div>
                <input type="submit" className="btn btn-primary" value="Submit"/>
            </form>
            {isError && <div className="alert alert-danger" role="alert">Add password failed!</div>}
        </div>
    )
}

export default AddPassword;