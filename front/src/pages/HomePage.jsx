import {HashLink} from "react-router-hash-link";
import {useEffect, useState} from "react";
import services from "../services.js";
import {FaXmark} from "react-icons/fa6";
import {MdOutlineSubtitles, MdRefresh} from "react-icons/md";
import {FaAngleRight, FaBackward, FaForward, FaPause, FaPlay, FaVolumeDown} from "react-icons/fa";
import Slider from "@mui/material/Slider";

// Format duration seconds -> mm:ss
function formatDuration(value) {
    const minute = Math.floor(value / 60);
    const secondLeft = Math.ceil(value - minute * 60) - 1;
    return `${minute}:${secondLeft < 10 ? `0${secondLeft}` : secondLeft}`;
}

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
    const [hasSub, sethasSub] = useState(false);
    const [details, setDetails] = useState("");

    // Media Control API Calls
    const pausePlayClick = () => {refreshStatus(); services.playPause().then(_ => setIsResumed(!isResumed)).catch(_ => displayMessage("Error playing/pausing", 2000)) }
    const stopClick = () => {services.stop().then(_ => setIsPlaying(false)).catch(_ => displayMessage("Error stopping", 2000))}
    async function forwardClick() {asyncRefreshStatus().then(t => {services.timestamp(Math.min(endTime, t + 10)).then(_ => setTimestamp(Math.min(endTime, t + 10))).catch(_ => displayMessage("Error skipping forward", 2000))})}
    async function backClick() {asyncRefreshStatus().then(t => {services.timestamp(Math.max(0, t - 10)).then(_ => setTimestamp(Math.max(0, t - 10))).catch(_ => displayMessage("Error skipping back", 2000))})}
    const onSetVolume = (v) => {services.volume(v).then(_ => setVolume(v)).catch(_ => displayMessage("Error changing volume", 2000))}
    const onSetTimestamp = (t) => {services.timestamp(t).then(_ => setTimestamp(t)).catch(_ => displayMessage("Error changing timestamp", 2000))}
    const onToggleSubs = () => {services.toggleSub().catch(_ => displayMessage("Error toggling sub", 2000))}

    // Refresh Status on First Refresh + SSEs
    async function asyncRefreshStatus() {
        return new Promise(resolve => {
            services.getStatus().then(status => {
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
                        setImage(thisItem["img"] === undefined ? (dark ? '/unknown_img_dark.png' : '/unknown_img.png') : services.getImgUrl(status.data.id, [status.data["group"]], [status.data["item"]]))
                    } else {  // single
                        // set single-dependent hooks
                        thisItem = status.data["playing"]["item"]
                        setImage(thisItem["img"] === undefined ? (dark ? '/unknown_img_dark.png' : '/unknown_img.png') : services.getImgUrl(status.data.id))
                    }
                    // set general hooks
                    sethasSub(thisItem["sub"] !== undefined || status.data["subsavailable"] === true)
                    setDetails(thisItem["text"] === undefined ? "" : thisItem["text"])

                    resolve(status.data["time"])
                } else {
                    setIsPlaying(false)
                }
            }).catch(_ => {
                displayMessage("Error getting media player status from server", -1)
                resolve()
            })
        })
    }
    const refreshStatus = () => {asyncRefreshStatus().then(_ => {})}
    useEffect(() => {setTimeout(refreshStatus, 500)}, []);  // refresh on first render after half a second  TODO: SSE

    // if media is playing, assume + 1 second every second
    const increaseSeconds = () => {
        if (timestamp >= endTime) {
            setIsPlaying(false)
            setIsResumed(false)
        } else if (isPlaying && isResumed) {
            const interval = setTimeout(() => setTimestamp(timestamp + 1), 1000)
            return () => {clearInterval(interval)}
        }
    }
    useEffect(increaseSeconds)

    return (
        <div className={dark ? "text-dark-surface-on" : "text-surface-on"}>
            {/* Media player */}
            <div className={!isPlaying ? "hidden" : ""}>
                <div className={dark ? "bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-dark-gradient1 via-dark-gradient2 to-dark-gradient3 p-8 min-h-screen h-full" : "bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-gradient1 via-gradient2 to-gradient3 p-8 min-h-screen h-full"}>
                    <div
                        className={dark ? "px-8 pb-8 py-4 rounded-2xl w-96 max-w-full m-auto relative z-[1] bg-dark-surface-trans backdrop-blur-2xl" : "px-8 pb-8 py-4 rounded-2xl w-96 max-w-full m-auto relative z-[1] bg-surface-trans backdrop-blur-2xl"}>
                        {/* Top buttons */}
                        <div className={"mb-4 flex flex-row justify-between"}>
                            <div className={"flex flex-row items-center cursor-pointer"} onClick={stopClick}>
                                <FaXmark className={dark ? "w-6 h-6 fill-error-container" : "w-6 h-6 fill-dark-error-container"}/>
                                <p className={dark ? "text-sm text-error-container" : "text-sm text-dark-error-container"}> Stop playback </p>
                            </div>
                            <div className={"flex flex-row items-center cursor-pointer"} onClick={refreshStatus}>
                                <MdRefresh className={dark ? "w-6 h-6 fill-dark-surface-on" : "w-6 h-6 fill-surface-on"}/>
                                <p className={dark ? "text-sm text-dark-surface-on" : "text-sm text-surface-on"}> Update status </p>
                            </div>
                        </div>

                        {/* Image and labels */}
                        <div className={"mb-4 grid grid-cols-2"}>
                            <div className={"w-32 h-32 overflow-hidden rounded-lg shadow-lg"}>
                                <img
                                    alt={`Image for ${title}`}
                                    src={image}
                                />
                            </div>
                            <div className={"text-left h-32 overflow-scroll"}>
                                <strong className={"text-lg"}>{title}</strong>
                                <div className={(group === undefined || item === undefined) ? "hidden" : ""}>
                                    <p className={"mt-1 italic"}>{group}</p>
                                    <FaAngleRight className={"inline ml-0.5"}></FaAngleRight><p
                                    className={"text-md inline"}>{item}</p>
                                </div>
                            </div>
                        </div>

                        {/* Time seeker */}
                        <div className={"flex items-center justify-between gap-3"}>
                            <p>{formatDuration(timestamp)}</p>
                            <Slider aria-label="time-indicator" size="small" value={timestamp} min={0} step={1} max={endTime} onChangeCommitted={(_, value) => onSetTimestamp(value)} sx={dark ? (_) => ({color: 'rgba(255, 255, 255,0.87)', height: 4,}) : (_) => ({color: 'rgba(0,0,0,0.87)', height: 4,})}/>
                            <p>{formatDuration(endTime)}</p>
                        </div>
                        <div className={"flex justify-center gap-7 my-4"}>
                            <FaBackward className={"w-8 h-8 cursor-pointer"} onClick={backClick}></FaBackward>
                            <FaPlay className={isResumed ? "hidden" : "w-8 h-8 cursor-pointer"}
                                    onClick={pausePlayClick}></FaPlay>
                            <FaPause className={!isResumed ? "hidden" : "w-8 h-8 cursor-pointer"}
                                     onClick={pausePlayClick}></FaPause>
                            <FaForward className={"w-8 h-8 cursor-pointer"} onClick={forwardClick}></FaForward>
                        </div>

                        {/* Volume control */}
                        <div className={"flex items-center justify-between gap-3"}>
                            <FaVolumeDown className={"m-2 w-6 h-6"}/>
                            <Slider className={"ml-1"} aria-label="Volume" value={volume} onChange={(_, value) => onSetVolume(value)} min={0} step={5} max={100} sx={dark ? ((_) => ({color: 'rgba(255,255,255,0.87)', '& .MuiSlider-track': {border: 'none',}, '& .MuiSlider-thumb': {width: 24, height: 24, backgroundColor: '#bfbfbf', '&::before': {boxShadow: '0 4px 8px rgba(0,0,0,0.4)',}, '&:hover, &.Mui-focusVisible, &.Mui-active': {boxShadow: 'none',},},})) : ((_) => ({color: 'rgba(0,0,0,0.87)', '& .MuiSlider-track': {border: 'none',}, '& .MuiSlider-thumb': {width: 24, height: 24, backgroundColor: '#fff', '&::before': {boxShadow: '0 4px 8px rgba(0,0,0,0.4)',}, '&:hover, &.Mui-focusVisible, &.Mui-active': {boxShadow: 'none',},},}))}/>
                            <div
                                className={!hasSub ? "hidden" : (dark ? "z-10 w-12 h-fit ml-2 bg-dark-primary-on p-1 rounded cursor-pointer drop-shadow-md shadow-dark-shadow" : "z-10 w-fit h-fit ml-2 bg-primary-on p-1 rounded cursor-pointer drop-shadow-md")}
                                onClick={onToggleSubs}>
                                <MdOutlineSubtitles className={"w-6 h-6"}/>
                            </div>
                            <div className={hasSub ? "hidden" : "w-14"}></div>
                        </div>
                    </div>

                    {/* Media details if mediainfo is present */}
                    <div className={details === "" ? "hidden" : "w-1/2 max-w-full mx-auto mt-10"}>
                        <h1 className={"text-2xl"}><strong>Details:</strong></h1>
                        <p className={"text-lg text-left mt-2"}>{details}</p>
                    </div>
                </div>
            </div>

            {/*  Info component - displayed if !isPlaying */}
            <div className={isPlaying ? "hidden" : ""}>
                <div
                    className={dark ? "bg-dark-surface rounded-lg px-6 py-8 shadow-xl shadow-dark-shadow w-11/12 mx-auto mt-10 flex flex-col items-start gap-4" : "bg-surface rounded-lg px-6 py-8 shadow-xl w-11/12 mx-auto mt-10 flex flex-col items-start gap-4"}>
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