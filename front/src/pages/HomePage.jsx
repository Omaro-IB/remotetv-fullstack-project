import {HashLink} from "react-router-hash-link";
import Player from "../components/Player";
import {useEffect, useState} from "react";
import services from "../services.js";

const HomePage = ({dark, displayMessage}) => {
    // Media Status Hooks
    const [isPlaying, setIsPlaying] = useState(false);
    const [isResumed, setIsResumed] = useState(false);
    const [timestamp, setTimestamp] = useState(0);
    const [endTime, setEndTime] = useState(0);
    const [volume, setVolume] = useState(0);
    const [title, setTitle] = useState("Loading...");
    const [image, setImage] = useState("");
    const [season, setSeason] = useState(undefined);
    const [episode, setEpisode] = useState(undefined);

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
                setSeason(status.data["season"])
                setEpisode(status.data["episode"])
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

    return (
        <div className={dark ? "text-dark-surface-on" : "text-surface-on"}>
            <div className={!isPlaying ? "hidden" : ""}>
                <Player dark={dark} timestamp={timestamp} endTime={endTime} onSetTimestamp={onSetTimestamp} isResumed={isResumed}
                         pausePlayClick={pausePlayClick} volume={volume} onSetVolume={onSetVolume} title={title} img={image}
                         forwardClick={forwardClick} backClick={backClick} stopClick={stopClick} season={season} episode={episode}/>
            </div>
            {/*  Info component - displayed if !isPlaying */}
            <div className={isPlaying ? "hidden" : ""}>
                <div className={dark ? "bg-dark-surface rounded-lg px-6 py-8 shadow-xl shadow-dark-shadow w-11/12 mx-auto mt-10 flex flex-col items-start gap-4" : "bg-surface rounded-lg px-6 py-8 shadow-xl w-11/12 mx-auto mt-10 flex flex-col items-start gap-4"}>
                    <p className={"text-left text-2xl sm:text-4xl"}> Nothing currently playing... </p>
                    <p className={"text-left text-xl sm:text-2xl"}>
                        Go to <span className={dark? "text-dark-primary underline" : "text-primary underline"}><HashLink to="/library">library</HashLink></span> to select something to play
                        or to <span className={dark? "text-dark-primary underline" : "text-primary underline"}><HashLink to="/search">search</HashLink></span> to add something to your library
                    </p>
                </div>
            </div>
        </div>
    )
}

export default HomePage;