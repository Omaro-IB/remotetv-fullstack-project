import './App.css'
import React, { useState } from 'react';
import HomePage from "./pages/HomePage.jsx";
import Navbar from "./components/Navbar.jsx";
import LibraryPage from "./pages/LibraryPage.jsx";
import SearchPage from "./pages/SearchPage.jsx";
import ErrorBar from "./components/ErrorBar.jsx";
import {
    BrowserRouter as Router,
    Routes,
    Route,
} from "react-router-dom";


const App = () => {
    // UI
    const [dark, setDark] = useState(false);
    const rootClassName = dark ? "bg-dark-surface h-fit min-h-screen w-full absolute top-0 left-0" : "bg-surface h-fit min-h-screen w-full absolute top-0 left-0"
    const toggleDark = () => setDark(!dark)

    // Error Messages
    const [errorMessage, setErrorMessage] = useState("")
    const displayMessage = (msg, time) => {
        if (time === -1) {setErrorMessage(msg)}
        else {setErrorMessage(msg); setTimeout(() => setErrorMessage(""), time)}
    }

    // Home Page + Navbar
    const HomePageN = () => (
        <div className={rootClassName}>
            <Navbar dark={dark} page={"Home"} toggleDark={toggleDark}/>
            <div className={(errorMessage === "") ? "hidden" : ""}><ErrorBar dark={dark} message={errorMessage}/></div>
            <HomePage dark={dark} displayMessage={displayMessage}/>
        </div>)

    // Library Page + Navbar
    const LibraryPageN = () => (
        <div className={rootClassName}>
            <Navbar dark={dark} page={"Library"} toggleDark={toggleDark}/>
            <div className={(errorMessage === "") ? "hidden" : ""}><ErrorBar dark={dark} message={errorMessage}/></div>
            <LibraryPage dark={dark} displayMessage={displayMessage}/>
        </div>)

    // Search Page + Navbar
    const SearchPageN = () => (
        <div className={rootClassName}>
            <Navbar dark={dark} page={"Search"} toggleDark={toggleDark}/>
            <div className={(errorMessage === "") ? "hidden" : ""}><ErrorBar dark={dark} message={errorMessage}/></div>
            <SearchPage dark={dark} displayMessage={displayMessage}/>
        </div>)

    return (
        <Router> <Routes> {/* The Switch decides which component to show based on the current URL.*/}
            <Route exact path="/" Component={HomePageN}/>
            <Route exact path="/home" Component={HomePageN}/>
            <Route exact path="/library" Component={LibraryPageN}/>
            <Route exact path="/search" Component={SearchPageN}/>
            <Route exact path="*" Component={HomePageN}/>
        </Routes> </Router>
    );
}

export default App;