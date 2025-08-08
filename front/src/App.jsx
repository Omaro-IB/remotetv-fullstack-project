import './App.css'
import React, {useEffect, useState} from 'react';
import HomePage from "./pages/HomePage.jsx";
import Navbar from "./components/Navbar.jsx";
import LibraryPage from "./pages/LibraryPage.jsx";
import ScanPage from "./pages/ScanPage.jsx";
import YouTubePage from "./pages/YouTubePage.jsx";
import ErrorBar from "./components/ErrorBar.jsx";
import {
    BrowserRouter as Router,
    Routes,
    Route,
} from "react-router-dom";
import services from "./services.js";


const App = () => {
    // UI
    const [dark, setDark] = useState(false);
    const [youtubeAvailable, setYoutubeAvailable] = useState(false);
    const rootClassName = dark ? "bg-dark-surface h-fit min-h-screen w-full absolute top-0 left-0" : "bg-surface h-fit min-h-screen w-full absolute top-0 left-0"
    const toggleDark = () => setDark(!dark)
    useEffect(() => {setTimeout(() => {
        services.checkYouTubeAvailable().then(result => {
        setYoutubeAvailable(result)
    })}, 500)}, []);

    // Error Messages
    const [errorMessage, setErrorMessage] = useState("")
    const displayMessage = (msg, time) => {
        if (time === -1) {setErrorMessage(msg)}
        else {setErrorMessage(msg); setTimeout(() => setErrorMessage(""), time)}
    }

    // Home Page + Navbar
    const HomePageN = () => (
        <div className={rootClassName}>
            <Navbar dark={dark} page={"Home"} displayYouTube={youtubeAvailable} toggleDark={toggleDark}/>
            <div className={(errorMessage === "") ? "hidden" : ""}><ErrorBar dark={dark} message={errorMessage}/></div>
            <HomePage dark={dark} displayMessage={displayMessage}/>
        </div>)

    // Library Page + Navbar
    const LibraryPageN = () => (
        <div className={rootClassName}>
            <Navbar dark={dark} page={"Library"} displayYouTube={youtubeAvailable} toggleDark={toggleDark}/>
            <div className={(errorMessage === "") ? "hidden" : ""}><ErrorBar dark={dark} message={errorMessage}/></div>
            <LibraryPage dark={dark} displayMessage={displayMessage}/>
        </div>)

    // Scanner Page + Navbar
    const ScannerPageN = () => (
        <div className={rootClassName}>
            <Navbar dark={dark} page={"Scan"} displayYouTube={youtubeAvailable} toggleDark={toggleDark}/>
            <div className={(errorMessage === "") ? "hidden" : ""}><ErrorBar dark={dark} message={errorMessage}/></div>
            <ScanPage dark={dark} displayMessage={displayMessage}/>
        </div>
    )

    // YouTube Page + Navbar
    const YouTubePageN = () => (
        <div className={rootClassName}>
            <Navbar dark={dark} page={"Yt"} displayYouTube={youtubeAvailable} toggleDark={toggleDark}/>
            <div className={(errorMessage === "") ? "hidden" : ""}><ErrorBar dark={dark} message={errorMessage}/></div>
            <YouTubePage dark={dark} displayMessage={displayMessage}/>
        </div>
    )

    const YouTubePageUnavailable = () => (
        <div className={rootClassName}>
            <Navbar dark={dark} page={"Yt"} displayYouTube={true} toggleDark={toggleDark}/>
            <div className={(errorMessage === "") ? "hidden" : ""}><ErrorBar dark={dark} message={errorMessage}/></div>
            <div className={dark ? "bg-dark-surface text-dark-surface-on w-full h-full" : "bg-surface text-surface-on w-full h-full"}>
                YouTube is unavailable due to missing yt-dl configuration.
            </div>
        </div>
    )

    return (
        <Router> <Routes> {/* The Switch decides which component to show based on the current URL.*/}
            <Route exact path="/" Component={HomePageN}/>
            <Route exact path="/home" Component={HomePageN}/>
            <Route exact path="/library" Component={LibraryPageN}/>
            <Route exact path="/scan" Component={ScannerPageN}/>
            <Route exact path="/yt" Component={youtubeAvailable ? YouTubePageN : YouTubePageUnavailable}/>
            <Route exact path="*" Component={HomePageN}/>
        </Routes> </Router>
    );
}

export default App;