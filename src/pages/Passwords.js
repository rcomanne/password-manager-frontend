import React, {useEffect, useState} from "react";
import {useAuth} from "../context/auth";
import {NavLink} from "react-router-dom";
import GeneratePassword from "../components/GeneratePassword";
import api from '../context/global';

function Passwords() {
    const [passwords, setPasswords] = useState([]);
    const [succeeded, setSucceeded] = useState(false);
    const [failed, setFailed] = useState(false);
    const [infoTimer, setInfoTimer] = useState(0);
    const [infoMessage, setInfoMessage] = useState("");
    const {authTokens} = useAuth();

    useEffect(() => {
        fetchPasswords().then();
    }, []);

    useEffect(() => {
        let interval = null;
        if (succeeded) {
            if (infoTimer > 0) {
                interval = setInterval(() => {
                    setInfoTimer(copyTimer => copyTimer - 1);
                }, 1000);
            } else {
                clearInterval(interval);
                setSucceeded(false);
                setInfoTimer(0);
            }
        }
        return () => clearInterval(interval);
    }, [succeeded, infoTimer])

    function updateAlert(message, successful) {
        setInfoMessage(message)
        setInfoTimer(3)
        setSucceeded(successful)
        setFailed(!successful)
    }

    async function fetchPasswords() {
        const response = await fetch('https://api.rcomanne.nl/pw/all', {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + authTokens,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        }).catch(console.log);

        if (response === undefined) {
            updateAlert("Could not get a response from the service.", false)
        } else if (response.ok) {
            const json = await response.json()
            setPasswords(json)
            updateAlert("Retrieved passwords", true)
        } else {
            const json = await response.json()
            updateAlert(json.message, false)
        }
    }

    async function fetchUnencryptedPassword(key, event) {
        event.preventDefault();
        const response = await fetch(api + '/pw/' + key, {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + authTokens,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        }).catch(console.log)

        if (response === undefined) {
            updateAlert("Could not get a response from the service.", false)
        } else if (response.ok) {
            const json = await response.json()
            navigator.clipboard.writeText(json.password)
                .then(() => {
                    updateAlert("Copy successful!", true)
                }).catch(console.log)
        } else {
            const json = await response.json()
            if (json.message === undefined) {
                updateAlert("Copy failed!", false)
            } else {
                updateAlert(json.message, false)
            }
        }
    }

    async function deletePassword(key, event) {
        event.preventDefault()
        const response = await fetch(api + '/pw/' + key, {
            method: 'DELETE',
            headers: {
                'Authorization': 'Bearer ' + authTokens,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        }).catch(console.log)

        if (response === undefined) {
            updateAlert("Could not get a response from the service.", false)
        } else if (response.ok) {
            updateAlert("Password successfully removed", true)
        } else {
            const json = await response.json()
            updateAlert(json.message, false)
        }
    }

    return (
        <div className="container-lg">
            <div className="row justify-content-center">
                <div className="col justify-content-start">
                    <div className="btn-group" role="group">
                        <button className="btn btn-sm btn-info" onClick={fetchPasswords}>Refresh</button>
                        <NavLink className="btn btn-sm btn-success" to="/addPassword">Add password</NavLink>
                    </div>
                </div>
                <div className="col justify-content-end">
                    <GeneratePassword/>
                </div>
            </div>
            {succeeded &&
            <div className="alert alert-success" role="alert">
                {infoMessage}
            </div>
            }
            {failed &&
            <div className="alert alert-danger" role="alert">
                {infoMessage}
            </div>
            }
            <div className="row justify-content-center">
                <div className="col">
                    <table className="table">
                        <thead className="thead-light">
                        <tr>
                            <th>Service</th>
                            <th>Username or email</th>
                            <th>Password</th>
                            <th>Actions</th>
                        </tr>
                        </thead>
                        <tbody>

                        {Object.keys(passwords).map(function (key) {
                            return (
                                <tr key={passwords[key].id}>
                                    <td>{passwords[key].domain}</td>
                                    <td>{passwords[key].name}</td>
                                    <td>
                                        <input type="password" disabled={true} value={passwords[key].password}/>
                                    </td>
                                    {
                                        document.queryCommandSupported('copy') &&
                                        <td>
                                            <div className="btn-group" role="group">
                                                <button className="btn btn-sm btn-success" onClick={e => {
                                                    fetchUnencryptedPassword(passwords[key].id, e)
                                                }}>Copy secret
                                                </button>
                                                <button className="btn btn-sm btn-primary" onClick={e => {

                                                }}>Update
                                                </button>
                                                <button className="btn btn-sm btn-danger" onClick={e => {
                                                    deletePassword(passwords[key].id, e)
                                                }}>Delete
                                                </button>
                                            </div>
                                        </td>
                                    }
                                </tr>
                            )
                        })}

                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

export default Passwords;