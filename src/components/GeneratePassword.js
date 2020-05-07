import React, {useState} from 'react';

function GeneratePassword() {
    const api = 'https://api.rcomanne.nl'

    const [isError, setIsError] = useState(false)
    const [errorMessage, setErrorMessage] = useState("")
    const [generatedPassword, setGeneratedPassword] = useState("")
    const [alphanumerical, setAlphanumerical] = useState(true)
    const [specialCharacters, setSpecialCharacters] = useState(true)

    function decideType() {
        if (specialCharacters) {
            return 'special';
        } else if (alphanumerical) {
            return 'ltrnum';
        } else if (!specialCharacters && !alphanumerical) {
            return 'ltr'
        } else {
            return 'all'
        }
    }

    async function getGeneratedPassword(event) {
        event.preventDefault()
        const type = decideType()
        const response = await fetch(api + '/pw/generate/16/' + type, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(

            )
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
                <form className="form-inline" onSubmit={getGeneratedPassword}>
                    <label className="sr-only">Generate password</label>
                    <input type="text" className="form-control mb-2 mr-sm-2" id="generatedPassword" value={generatedPassword} readOnly={true}/>

                    <div className="form-check form-check-inline">
                        <input className="form-check-input" type="checkbox" id="alphanumerical" checked={alphanumerical} onChange={event => {
                            setAlphanumerical(event.target.checked)
                        }}/>
                        <label className="form-check-label" htmlFor="alphanumerical">Alphanumerical</label>
                    </div>

                    <div className="form-check form-check-inline">
                        <input className="form-check-input" type="checkbox" id="specialCharacter" checked={specialCharacters} onChange={event => {
                            setSpecialCharacters(event.target.checked)
                        }}/>
                        <label className="form-check-label" htmlFor="specialCharacter">Special characters</label>
                    </div>

                    <button type="submit" className="btn btn-primary">Generate</button>
                </form>
                { isError && <div className="alert alert-danger" role="alert">{errorMessage}</div> }
            </div>
        </div>
    )
}

export default GeneratePassword;