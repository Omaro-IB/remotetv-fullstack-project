import React, {useState} from "react";
import services from "../services.js";
import {useNavigate} from "react-router-dom";


const YouTubePage = ({dark, displayMessage}) => {
    const [url, setUrl] = useState('');
    const [displayLoading, setDisplayLoading] = useState(false)
    const navigate = useNavigate()

    const onSubmitClick = () => {
        setDisplayLoading(true)
        services.playYouTube(url).then(() => navigate("/")).catch(() => {
            displayMessage("Error playing YouTube video", 2000)
            setDisplayLoading(false)
        })
    }

    return (
        <div className={dark ? "text-dark-surface-on" : "text-surface-on"}>
            <input
                className={dark ? "bg-dark-surface border-2 border-dark-primary w-2/3 sm:w-1/3 h-8 m-4" : "bg-surface border-2 border-primary w-2/3 sm:w-1/3 h-8 m-4"}
                type="url"
                placeholder={"Enter YouTube video URL"}
                value={url} onChange={(e) => {
                setUrl(e.target.value)
            }}/>
            <button
                className={displayLoading ? "hidden" : (dark ? "bg-dark-primary-container text-dark-primary-container-on rounded-sm shadow-lg shadow-dark-shadow m-4 p-2" : "bg-primary-container text-primary-container-on rounded-sm shadow-lg m-4 p-2")}
                onClick={onSubmitClick}>Play video
            </button>
            <p className={displayLoading ? "" : "hidden"}>
                Please wait... you will be redirected when the video loads
            </p>
        </div>
    )
}

export default YouTubePage;