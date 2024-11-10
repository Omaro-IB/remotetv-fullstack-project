import './App.css'
import React, { useEffect, useState } from 'react';
import HomePage from "./pages/HomePage.jsx";
import Player from "./components/Player.jsx"
import Navbar from "./components/Navbar.jsx";
import LibraryPage from "./pages/LibraryPage.jsx";
import SearchPage from "./pages/SearchPage.jsx";
import ErrorBar from "./components/ErrorBar.jsx";
import services from "./services.js"
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

    // Media Status Hooks
    const [isPlaying, setIsPlaying] = useState(false);
    const [isResumed, setIsResumed] = useState(false);
    const [timestamp, setTimestamp] = useState(0);
    const [endTime, setEndTime] = useState(0);
    const [volume, setVolume] = useState(0);
    const [title, setTitle] = useState("Loading...");
    const [image, setImage] = useState("");

    // Media Control API Calls
    const pausePlayClick = () => {services.playPause().then(_ => setIsResumed(!isResumed)).catch(_ => displayMessage("Error playing/pausing", 2000)) }
    const stopClick = () => {services.stop().then(_ => setIsPlaying(false)).catch(_ => displayMessage("Error stopping", 2000))}
    const backClick = () => {services.timestamp(Math.max(0, timestamp - 10)).then(_ => setTimestamp(Math.max(0, timestamp - 10))).catch(_ => displayMessage("Error skipping back", 2000))}
    const forwardClick = () => {services.timestamp(Math.min(endTime, timestamp + 10)).then(_ => setTimestamp(Math.min(endTime, timestamp + 10))).catch(_ => displayMessage("Error skipping forward", 2000))}
    const onSetVolume = (v) => {services.volume(v).then(_ => setVolume(v)).catch(_ => displayMessage("Error changing volume", 2000))}
    const onSetTimestamp = (t) => {services.timestamp(t).then(_ => setTimestamp(t)).catch(_ => displayMessage("Error changing timestamp", 2000))}

    // Refresh Status on First Refresh + SSEs
    const refreshStatus = () => {
        services.getStatus().then(status => {
            if (!(status.data["playing"] === false)) {
                setIsPlaying(true)
                setTitle(status.data["playing"]["metadata"]["title"])
                setImage(status.data["playing"]["metadata"]["image"])
                setIsResumed(status.data["resumed"])
                setTimestamp(status.data["time"])
                setEndTime(status.data["endTime"])
                setVolume(status.data["volume"])
            } else {
                setIsPlaying(false)
            }
        }).catch(err => {
            console.log(err)
            displayMessage("Error getting media player status from server", -1)
        })
    }
    useEffect(refreshStatus, []);  // refresh on first render  TODO: SSE

    const increaseSeconds = () => {
        if (isPlaying && isResumed) {
            const interval = setTimeout(() => setTimestamp(timestamp + 1), 1000)
            return () => {clearInterval(interval)}
        }
    }
    useEffect(increaseSeconds)  // if media is playing, assume + 1 second every second

    // Home Page + Navbar
    const HomePageN = () => (
        <div className={rootClassName}>
            <Navbar dark={dark} page={"Home"} toggleDark={toggleDark}/>
            <div className={(errorMessage === "") ? "hidden" : ""}><ErrorBar dark={dark} message={errorMessage}/></div>
            <HomePage dark={dark} showPlayer={isPlaying}>
                <Player dark={dark} timestamp={timestamp} endTime={endTime} onSetTimestamp={onSetTimestamp} isResumed={isResumed}
                        pausePlayClick={pausePlayClick} volume={volume} onSetVolume={onSetVolume} title={title} img={image}
                        forwardClick={forwardClick} backClick={backClick} stopClick={stopClick}/>
            </HomePage>
        </div>)

    // Library Page + Navbar
    const LibraryPageN = () => (
        <div className={rootClassName}>
            <Navbar dark={dark} page={"Library"} toggleDark={toggleDark}/>
            <div className={(errorMessage === "") ? "hidden" : ""}><ErrorBar dark={dark} message={errorMessage}/></div>
            <LibraryPage dark={dark} playCallback={() => setTimeout(refreshStatus, 500)}
                errorCallback1={() => displayMessage("Error getting library data from server", -1)}
                errorCallback2={() => displayMessage("Error playing this media", 2000)}/>
        </div>)

    // Search Page + Navbar
    const SearchPageN = () => (
        <div className={rootClassName}>
            <Navbar dark={dark} page={"Search"} toggleDark={toggleDark}/>
            <div className={(errorMessage === "") ? "hidden" : ""}><ErrorBar dark={dark} message={errorMessage}/></div>
            <SearchPage dark={dark}/>
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