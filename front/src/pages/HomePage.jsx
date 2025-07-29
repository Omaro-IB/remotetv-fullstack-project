import {HashLink} from "react-router-hash-link";
import React, {useEffect, useState} from "react";
import services from "../services.js";
import {FaXmark} from "react-icons/fa6";
import {MdOutlineSubtitles, MdRefresh} from "react-icons/md";
import {FaAngleRight, FaBackward, FaForward, FaPause, FaPlay, FaVolumeDown} from "react-icons/fa";
import Slider from "@mui/material/Slider";

// Format duration seconds -> minutes, seconds
function formatDuration(value) {
    const minute = Math.floor(value / 60);
    const second = Math.max(0, Math.ceil(value - minute * 60) - 1);
    return [minute, second]
}

const TimeSelector = ({dark, onCloseClick, maxMinutes, minutes, seconds, onMinutesChange, onSecondsChange, onSubmit}) => (
    <div>
        {/* Close selector */}
        <div className={"w-7 h-7 mb-5"}>
            <button onClick={onCloseClick}>
                <FaXmark className={dark ? "fill-dark-primary w-7 h-7" : "fill-primary w-7 h-7"}/>
            </button>
        </div>
        {/* Selector */}
        <div className={"flex flex-row w-fit mx-auto items-center"}>
            <p className={"mr-2"}>Set time: </p>
            <input className={dark ? "bg-dark-surface" : "bg-surface"} type="number" min="0" max={maxMinutes} value={minutes} onChange={(e) => {onMinutesChange(e.target.value)}}/>
            <p className={"mx-2"}>:</p>
            <input className={dark ? "bg-dark-surface" : "bg-surface"} type="number" min="0" max="60" value={seconds} onChange={(e) => {onSecondsChange(e.target.value)}}/>
            <button onClick={onSubmit} className={dark ? "bg-dark-primary-container w-fit p-1 mx-1 text-dark-primary-container-on rounded drop-shadow-md shadow-dark-shadow ml-4" : "bg-primary-container w-fit p-1 mx-1 text-primary-container-on rounded drop-shadow-md ml-4"}>
                Submit
            </button>
        </div>
    </div>
)

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

    const [timeSelectorM, setTimeSelectorM] = useState(-1);
    const [timeSelectorS, setTimeSelectorS] = useState(-1);

    // Media Control API Calls
    async function pausePlayClick() {asyncRefreshStatus().then(s => {services.playPause().then(_ => setIsResumed(!s[0])).catch(_ => displayMessage("Error playing/pausing", 2000))})}
    const stopClick = () => {services.stop().then(_ => setIsPlaying(false)).catch(_ => displayMessage("Error stopping", 2000))}
    async function forwardClick() {asyncRefreshStatus().then(s => {services.timestamp(Math.min(endTime, s[1] + 10)).then(_ => setTimestamp(Math.min(endTime, s[1] + 10))).catch(_ => displayMessage("Error skipping forward", 2000))})}
    async function backClick() {asyncRefreshStatus().then(s => {services.timestamp(Math.max(0, s[1] - 10)).then(_ => setTimestamp(Math.max(0, s[1] - 10))).catch(_ => displayMessage("Error skipping back", 2000))})}
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
                        setImage(thisItem["img"] === undefined ? (status.data["playing"]["global_img"] !== undefined ? services.getImgUrl(status.data["id"]) : (dark ? '/unknown_img_dark.png' : '/unknown_img.png')) : services.getImgUrl(status.data.id, [status.data["group"]], [status.data["item"]]))
                    } else {  // single
                        // set single-dependent hooks
                        thisItem = status.data["playing"]["item"]
                        setImage(thisItem["img"] === undefined ? (dark ? '/unknown_img_dark.png' : '/unknown_img.png') : services.getImgUrl(status.data.id))
                    }
                    // set general hooks
                    sethasSub(thisItem["sub"] !== undefined || status.data["subsavailable"] === true)
                    setDetails(thisItem["text"] === undefined ? (status.data["playing"]["global_text"] !== undefined ? status.data["playing"]["global_text"] : "") : thisItem["text"])

                    resolve([status.data["resumed"], status.data["time"]])
                } else {
                    setIsPlaying(false)
                }
            }).catch(_ => {
                displayMessage("Error getting media player status from server", -1)
                resolve([null, null])
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

    const endTimeMS = formatDuration(endTime)
    const currentTimeMS = formatDuration(timestamp)
    const formattedCurrentTime = `${currentTimeMS[0] < 10 ? `0${currentTimeMS[0]}` : currentTimeMS[0]}:${currentTimeMS[1] < 10 ? `0${currentTimeMS[1]}` : currentTimeMS[1]}`
    const formattedEndTime = `${endTimeMS[0] < 10 ? `0${endTimeMS[0]}` : endTimeMS[0]}:${endTimeMS[1] < 10 ? `0${endTimeMS[1]}` : endTimeMS[1]}`

    return (
        <div className={dark ? "text-dark-surface-on" : "text-surface-on"}>
            {/* Media player */}
            <div className={!isPlaying ? "hidden" : ""}>
                <div className={dark ? "bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-dark-gradient1 via-dark-gradient2 to-dark-gradient3 p-8 min-h-screen h-full" : "bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-gradient1 via-gradient2 to-gradient3 p-8 min-h-screen h-full"}>
                    <div
                        className={dark ? "p-4 rounded-2xl w-96 max-w-full m-auto relative z-[1] bg-dark-surface-trans backdrop-blur-2xl" : "p-4 rounded-2xl w-96 max-w-full m-auto relative z-[1] bg-surface-trans backdrop-blur-2xl"}>
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
                        <div className={"mb-4 flex flex-row"}>
                            <div className={"w-32 h-32 overflow-hidden rounded-lg shadow-lg"}>
                                <img
				    className={"w-full h-full object-cover"}
                                    alt={`Image for ${title}`}
                                    src={image}
                                />
                            </div>
                            <div className={"text-left ml-4 mr-auto w-fit h-full overflow-scroll"}>
                                <strong className={"text-lg"}>{services.parseMediaFilename(title)["name"]}</strong>
                                <div className={(group === undefined || item === undefined) ? "hidden" : ""}>
                                    <p className={"mt-1 italic"}>{group}</p>
                                    <FaAngleRight className={"inline ml-0.5"}></FaAngleRight><p
                                    className={"text-md inline"}>{item === undefined ? undefined : services.formatEpisodeString(item)}</p>
                                </div>
                            </div>
                        </div>

                        {/* Time seeker */}
                        <div className={"flex items-center justify-between gap-3"}>
                            <button className={dark ? "underline text-dark-tertiary" : "underline text-tertiary"} onClick={() => {setTimeSelectorM(currentTimeMS[0]); setTimeSelectorS(currentTimeMS[1])}}>{formattedCurrentTime}</button>
                            <Slider aria-label="time-indicator" size="small" value={timestamp} min={0} step={1} max={endTime} onChangeCommitted={(_, value) => onSetTimestamp(value)} sx={dark ? (_) => ({color: 'rgba(255, 255, 255,0.87)', height: 4,}) : (_) => ({color: 'rgba(0,0,0,0.87)', height: 4,})}/>
                            <p>{formattedEndTime}</p>
                        </div>
                        <div className={"flex justify-center gap-7 my-4"}>
                            <FaBackward className={"w-8 h-8 cursor-pointer"} onClick={backClick}></FaBackward>
                            <FaPlay className={isResumed ? "hidden" : "w-8 h-8 cursor-pointer"} onClick={pausePlayClick}></FaPlay>
                            <FaPause className={!isResumed ? "hidden" : "w-8 h-8 cursor-pointer"} onClick={pausePlayClick}></FaPause>
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

            {/* Time selector */}
            <div className={(timeSelectorM === -1 ? "hidden" : "absolute top-0 left-0 w-full h-full z-10")}>
                <div className={dark ? "sticky top-10 mx-auto bg-dark-surface p-5 rounded-lg shadow-2xl shadow-dark-shadow w-fit px-102 min-h-20 max-h-[90vh] h-fit overflow-auto" : "sticky top-10 mx-auto bg-surface p-5 rounded-lg shadow-2xl w-fit px-10 min-h-20 max-h-[90vh] h-fit overflow-auto"}>
                    <TimeSelector dark={dark} onCloseClick={() => setTimeSelectorM(-1)} maxMinutes={endTimeMS[0]} minutes={timeSelectorM} seconds={timeSelectorS} onMinutesChange={(m) => setTimeSelectorM(m)} onSecondsChange={(s) => setTimeSelectorS(s)} onSubmit={() => {onSetTimestamp(parseInt(timeSelectorM) * 60 + (parseInt(timeSelectorS) + 1))}}/>
                </div>
            </div>
        </div>
    )
}

export default HomePage;
