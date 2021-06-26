import React ,{useContext} from 'react'
import {BrowserRouter , Switch, Route } from 'react-router-dom'
import LoginForm from "./components/Login"
import Navbar  from "./components/layouts/Navbar"
import AuthContext from './components/context/AuthContext';
import Footer from "./components/layouts/Footer"
import Home from './components/Home';

import axios from 'axios'
import Branches from './components/branchesInformation/Branches';
import Notification from './components/notifications/Notifications';

axios.defaults.withCredentials = true;

function Router(){

    const { loggedIn }= useContext(AuthContext)
    return (

        <BrowserRouter >
        <Navbar />
            <Switch>
                <Route exact path="/">
                    <Home />
                </Route>
                <Route path="/login">
                    <LoginForm />
                </Route>
                {loggedIn === true  && <>
                    <Route path="/notifications" component = { Notification }></Route>
                    </> }
                <Route path ="/branches" component = { Branches } ></Route>    
            </Switch>
        <Footer />
        </BrowserRouter>


    );
}

export default Router; 
