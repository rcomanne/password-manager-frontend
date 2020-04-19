import React, {useState} from "react";
import {useAuth} from "../context/auth";

function Passwords(props) {
    const [passwords, setPasswords] = useState([]);
    const { authTokens } = useAuth();
    console.log("fetching passwords");

    function fetchPasswords() {
        console.log("fetching passwords")
        fetch('http://localhost:8080/pw', {
            method: 'GET',
            mode: 'no-cors',
            headers: {
                'Authorization': 'Bearer ' + authTokens,
                'Accept': 'application/json'
            }
        })
            .then(results => results.json())
            .then(data => {
                console.log("fetched passwords: ", data)
                setPasswords(data);
            })
            .catch(console.log)
    }

    function fetchUnencryptedPassword(event) {
        console.log("fetching unencrypted password")
        fetch('http://localhost:8080/pw/test')
            .then(results => results.json())
            .then(data => {
                console.log("fetched passwords: ", data)
                setPasswords(data);
            })
            .catch(console.log)
    }

    return (
        <div className="container">
            <table className="table">
                <thead className="thead-light">
                <tr>
                    <th>Service</th>
                    <th>Username or email</th>
                    <th>Password</th>
                    <th>Retrieve</th>
                    <th>
                        <button className="btn btn-sm btn-info" onClick={fetchPasswords}>Refresh</button>
                    </th>
                </tr>
                </thead>
                <tbody>
                {passwords.map((password, index) => {
                    return (
                        <tr key={index}>
                            <td>{password.domain}</td>
                            <td>{password.name}</td>
                            <td>{password.password}</td>
                            <td>
                                <button className="btn btn-sm btn-success">Copy secret</button>
                            </td>
                        </tr>
                    )
                })}
                </tbody>
            </table>
        </div>
    )
}

export default Passwords;