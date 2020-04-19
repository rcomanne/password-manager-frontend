import React, {useState} from "react";
import {Link, Redirect} from "react-router-dom";
import {useAuth} from "../context/auth";

function Register() {
    const [isLoggedIn, setLoggedIn] = useState(false);
    const [isError, setIsError] = useState(false);
    const [mail, setMail] = useState("");
    const [password1, setPassword1] = useState("");
    const [password2, setPassword2] = useState("");
    const {setAuthTokens} = useAuth();

    async function postRegister() {
        if (password1 !== password2) {
            setIsError(true);
            return;
        }

        console.log("submit registration form");
        const response = await fetch('http://localhost:8080/user/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "mail": mail,
                "password": password1
            })
        }).catch(console.log);
        console.log(response);
        if (response.ok) {
            const json = await response.json();
            setAuthTokens(json.jwtToken);
            setLoggedIn(true);
        } else {
            setIsError(true);
        }
    }

    if (isLoggedIn) {
        return <Redirect to="/"/>
    }

    return (
        <div className="container">
            <form onSubmit={postRegister}>
                <div className="form-group">
                    <label htmlFor="registerEmail">Email address</label>
                    <input id="mail" type="email" className="form-control" required={true} placeholder="Enter email" onChange={e => {
                        setMail(e.target.value);
                    }}/>
                </div>
                <div className="form-group">
                    <label htmlFor="registerPassword1">Password</label>
                    <input id="password1" type="password" className="form-control" required={true} placeholder="Password" onChange={e => {
                        setPassword1(e.target.value);
                    }}/>
                </div>
                <div className="form-group">
                    <label htmlFor="registerPassword2">Retype password</label>
                    <input id="password2" type="password" className="form-control" required={true} placeholder="Retype password" onChange={e => {
                        setPassword2(e.target.value);
                    }}/>
                </div>
                <input type="submit" className="btn btn-primary" value="Submit"/>
            </form>
            <Link to="/login">Already have an account?</Link>
            { isError && <div className="alert alert-danger" role="alert">Registration failed!</div> }
        </div>
    )
}

export default Register;