import React, {useState} from "react";
import {
    Route,
    NavLink,
    BrowserRouter as Router
} from "react-router-dom";
import Home from "./pages/Home";
import Passwords from "./pages/Passwords";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Contact from "./pages/Contact";
import {AuthContext} from "./context/auth";
import PrivateRoute from "./PrivateRoute";

function App() {
    const existingTokens = JSON.parse(localStorage.getItem("tokens"));
    const [authTokens, setAuthTokens] = useState(existingTokens);

    const setTokens = (data) => {
        if (data === undefined) {
            logout();
        } else {
            localStorage.setItem("tokens", JSON.stringify(data));
            setAuthTokens(data);
        }
    }

    function logout() {
        localStorage.removeItem("tokens");
        setAuthTokens('');
    }

    return (
        <AuthContext.Provider value={{authTokens, setAuthTokens: setTokens}}>
            <Router>
                <div className="container">
                    <h1 className="jumbotron">Password manager</h1>

                    <nav className="navbar navbar-expand-lg navbar-light bg-light">
                        <div className="collapse navbar-collapse justify-content-center">
                            <ul className="navbar-nav">
                                <li className="nav-item">
                                    <NavLink className="nav-link" to="/">Home</NavLink>
                                </li>
                                <li className="nav-item">
                                    <NavLink className="nav-link" to="/passwords">My Passwords</NavLink>
                                </li>
                                <li className="nav-item">
                                    <NavLink className="nav-link" to="/contact">Contact</NavLink>
                                </li>

                                {!authTokens &&
                                <li className="nav-item">
                                    <NavLink className="nav-link" to="/login">Login</NavLink>
                                </li>
                                }

                                {authTokens &&
                                <li className="nav-item">
                                    <NavLink className="nav-link" to="/logout">Logout</NavLink>
                                </li>
                                }
                            </ul>
                        </div>
                    </nav>

                    <div className="content container">
                        <Route exact path="/" component={Home}/>
                        <PrivateRoute exact path="/passwords" component={Passwords}/>
                        <Route exact path="/login" component={Login}/>
                        <Route exact path="/register" component={Register}/>
                        <Route exact path="/contact" component={Contact}/>
                    </div>
                </div>
            </Router>
        </AuthContext.Provider>
    )
}

export default App;