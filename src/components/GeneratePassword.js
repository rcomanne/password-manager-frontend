import React, {useState} from 'react';
import api from '../context/global';

function GeneratePassword() {
    const [isError, setIsError] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [generatedPassword, setGeneratedPassword] = useState("");

    async function getRandomPassword(event) {
        event.preventDefault();
        const response = await fetch(api + '/pw/generate/16', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        }).catch(console.log);
        if (response === undefined) {
            setIsError(true);
            setErrorMessage("Could not get a response from the service.")
        } else if (response.ok) {
            const json = await response.json();
            setGeneratedPassword(json.generated)
        } else {
            const json = await response.json();
            setErrorMessage(json.message);
            setIsError(true);
        }
    }

    return (
        <div>
            <div className="container">
                <form className="form-inline" onSubmit={getRandomPassword}>
                        <label className="sr-only">Generate password</label>
                        <input type="text" className="form-control mb-2 mr-sm-2" id="generatedPassword" value={generatedPassword} readOnly={true}/>
                    <button type="submit" className="btn btn-primary">Generate</button>
                </form>
                { isError && <div className="alert alert-danger" role="alert">{errorMessage}</div> }
            </div>
        </div>
    )
}

export default GeneratePassword;