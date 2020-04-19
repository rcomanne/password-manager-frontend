import React, {useEffect, useState} from "react";
import {useAuth} from "../context/auth";
import {NavLink} from "react-router-dom";

function Passwords() {
    const [passwords, setPasswords] = useState([]);
    const [copySucceeded, setCopySucceeded] = useState(false);
    const [copyTimer, setCopyTimer] = useState(0);
    const {authTokens} = useAuth();

    useEffect(() => {
        fetchPasswords().then();
    }, []);

    useEffect(() => {
        let interval = null;
        if (copySucceeded) {
            if (copyTimer > 0) {
                interval = setInterval(() => {
                    setCopyTimer(copyTimer => copyTimer -1);
                }, 1000);
            } else {
                clearInterval(interval);
                setCopySucceeded(false);
                setCopyTimer(0);
            }
        }
        return () => clearInterval(interval);
    }, [copySucceeded, copyTimer]);

    async function fetchPasswords() {
        console.log("fetching passwords")
        await fetch('http://localhost:8181/pw/all', {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + authTokens,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        })
            .then(results => results.json())
            .then(data => {
                setPasswords(data);
            })
            .catch(console.log);
    }

    function fetchUnencryptedPassword(key, event) {
        event.preventDefault();
        console.log("fetching unencrypted password")
        fetch('http://localhost:8181/pw/' + key, {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + authTokens,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        })
            .then(results => results.json())
            .then(data => {
                navigator.clipboard.writeText(data.password)
                    .then(() => {
                        setCopyTimer(3)
                        setCopySucceeded(true)
                    }).catch(console.log)
            })
            .catch(console.log)
    }

    return (
        <div className="container">
            <div className="btn-group" role="group">
                <button className="btn btn-sm btn-info" onClick={fetchPasswords}>Refresh</button>
                <NavLink className="btn btn-sm btn-success" to="/addPassword">Add password</NavLink>
            </div>
            {copySucceeded &&
            <div className="alert alert-success" role="alert">
                Copy succeeded!
            </div>
            }
            <table className="table">
                <thead className="thead-light">
                <tr>
                    <th>Service</th>
                    <th>Username or email</th>
                    <th>Password</th>
                    <th>Retrieve</th>
                </tr>
                </thead>
                <tbody>

                {Object.keys(passwords).map(function (key) {
                    return (
                        <tr key={key}>
                            <td>{passwords[key].domain}</td>
                            <td>{passwords[key].name}</td>
                            <td>
                                <input type="password" disabled={true} value={passwords[key].password}/>
                            </td>
                            {
                                document.queryCommandSupported('copy') &&
                                <td>
                                    <button className="btn btn-sm btn-success" onClick={e => {
                                        fetchUnencryptedPassword(key, e)
                                    }}>Copy secret
                                    </button>
                                </td>
                            }
                        </tr>
                    )
                })}

                </tbody>
            </table>
        </div>
    )
}

export default Passwords;