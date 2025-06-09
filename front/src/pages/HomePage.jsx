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
    const [group, setGroup] = useState(undefined);
    const [item, setItem] = useState(undefined);
    const [image, setImage] = useState("");
    const [sub, setSub] = useState("");
    const [details, setDetails] = useState("");

    // Media Control API Calls
    const pausePlayClick = () => {services.playPause().then(_ => setIsResumed(!isResumed)).catch(_ => displayMessage("Error playing/pausing", 2000)) }
    const stopClick = () => {services.stop().then(_ => setIsPlaying(false)).catch(_ => displayMessage("Error stopping", 2000))}
    const backClick = () => {services.timestamp(Math.max(0, timestamp - 10)).then(_ => setTimestamp(Math.max(0, timestamp - 10))).catch(_ => displayMessage("Error skipping back", 2000))}
    const forwardClick = () => {services.timestamp(Math.min(endTime, timestamp + 10)).then(_ => setTimestamp(Math.min(endTime, timestamp + 10))).catch(_ => displayMessage("Error skipping forward", 2000))}
    const onSetVolume = (v) => {services.volume(v).then(_ => setVolume(v)).catch(_ => displayMessage("Error changing volume", 2000))}
    const onSetTimestamp = (t) => {services.timestamp(t).then(_ => setTimestamp(t)).catch(_ => displayMessage("Error changing timestamp", 2000))}
    const onToggleSubs = () => {services.toggleSub().catch(_ => displayMessage("Error toggling sub", 2000))}

    // Refresh Status on First Refresh + SSEs
    const refreshStatus = () => {
        services.getStatus().then(status => {
            console.log(status)

            if (!(status.data["playing"] === false)) {
                setIsPlaying(true)
                setTitle(status.data["playing"]["name"])
                setIsResumed(status.data["resumed"])
                setTimestamp(status.data["time"])
                setEndTime(status.data["endTime"])
                setVolume(status.data["volume"])

                let thisItem
                if ('items' in status.data["playing"]) {  // collection
                    // set collection-dependent hooks
                    setGroup(status.data["playing"]["group_labels"][status.data["group"]])
                    setItem(status.data["playing"]["item_labels"][status.data["group"]][status.data["item"]])
                    thisItem = status.data["playing"]["items"][status.data["group"]][status.data["item"]]
                    setImage(thisItem["img"] === undefined ? "" : services.getImgUrl(status.data.id, [status.data["group"]], [status.data["item"]]))
                } else {  // single
                    // set single-dependent hooks
                    thisItem = status.data["playing"]["item"]
                    setImage(thisItem["img"] === undefined ? "" : services.getImgUrl(status.data.id))
                }
                // set general hooks
                setSub(thisItem["sub"] === undefined ? "" : thisItem["sub"])
                setDetails(thisItem["text"] === undefined ? "" : thisItem["text"])

            } else {
                setIsPlaying(false)
            }
        }).catch(err => {
            console.log(err)
            displayMessage("Error getting media player status from server", -1)
        })
    }
    useEffect(() => {setTimeout(refreshStatus, 500)}, []);  // refresh on first render after half a second  TODO: SSE

    const increaseSeconds = () => {
        if (timestamp >= endTime) {
            setIsPlaying(false)
            setIsResumed(false)
        } else if (isPlaying && isResumed) {
            const interval = setTimeout(() => setTimestamp(timestamp + 1), 1000)
            return () => {clearInterval(interval)}
        }
    }
    useEffect(increaseSeconds)  // if media is playing, assume + 1 second every second

    return (
        <div className={dark ? "text-dark-surface-on" : "text-surface-on"}>
            <div className={!isPlaying ? "hidden" : ""}>
                <Player dark={dark} timestamp={timestamp} endTime={endTime} onSetTimestamp={onSetTimestamp} isResumed={isResumed} pausePlayClick={pausePlayClick}
                        volume={volume} onSetVolume={onSetVolume} title={title} img={image} forwardClick={forwardClick} backClick={backClick} stopClick={stopClick}
                        season={group} episode={item} subClick={sub === "" ? null : onToggleSubs} details={details} />
            </div>
            {/*  Info component - displayed if !isPlaying */}
            <div className={isPlaying ? "hidden" : ""}>
                <div className={dark ? "bg-dark-surface rounded-lg px-6 py-8 shadow-xl shadow-dark-shadow w-11/12 mx-auto mt-10 flex flex-col items-start gap-4" : "bg-surface rounded-lg px-6 py-8 shadow-xl w-11/12 mx-auto mt-10 flex flex-col items-start gap-4"}>
                    <p className={"text-left text-2xl sm:text-4xl"}> Nothing currently playing... </p>
                    <p className={"text-left text-xl sm:text-2xl"}>
                        Go to <span className={dark? "text-dark-primary underline" : "text-primary underline"}><HashLink to="/library">library</HashLink></span> to select something to play
                    </p>
                </div>
            </div>
        </div>
    )
}

export default HomePage;