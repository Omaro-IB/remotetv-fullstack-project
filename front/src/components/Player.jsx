import Slider from '@mui/material/Slider';
import {FaPause, FaPlay, FaForward, FaBackward, FaVolumeDown, FaAngleRight} from "react-icons/fa";
import { MdOutlineSubtitles } from "react-icons/md";
import { FaXmark } from "react-icons/fa6";

const Container = ({children, dark, below}) => (
    <div className={dark ? "bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-dark-gradient1 via-dark-gradient2 to-dark-gradient3 p-8 min-h-screen h-full" : "bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-gradient1 via-gradient2 to-gradient3 p-8 min-h-screen h-full"}>
        <div
            className={dark ? "px-8 pb-8 py-4 rounded-2xl w-96 max-w-full m-auto relative z-[1] bg-dark-surface-trans backdrop-blur-2xl" : "px-8 pb-8 py-4 rounded-2xl w-96 max-w-full m-auto relative z-[1] bg-surface-trans backdrop-blur-2xl"}>
            {children}
        </div>
        {below}
    </div>
)

export default function Player({dark, timestamp, endTime, onSetTimestamp, isResumed, pausePlayClick, volume, onSetVolume, img, title, season, episode, stopClick, backClick, forwardClick, subClick, details, hasSub}) {
    function formatDuration(value) {
        const minute = Math.floor(value / 60);
        const secondLeft = Math.ceil(value - minute * 60);
        return `${minute}:${secondLeft < 10 ? `0${secondLeft}` : secondLeft}`;
    }

    const below = (
        <div className={details === "" ? "hidden" : "w-1/2 max-w-full mx-auto mt-10"}>
            <h1 className={"text-2xl"}><strong>Details:</strong></h1>
            <p className={"text-lg text-left mt-2"}>{details}</p>
        </div>
    )

    return (
        <Container dark={dark} below={below}>
            <div className={"mb-2 cursor-pointer flex flex-row items-center"} onClick={stopClick}>
                <FaXmark className={dark ? "w-6 h-6 fill-error-container" : "w-6 h-6 fill-dark-error-container"} />
                <p className={dark ? "text-sm ml-2 text-error-container" : "text-sm ml-2 text-dark-error-container"}> Stop Playback</p>
            </div>
            <div className={"mb-4 grid grid-cols-2"}>
                <div className={"w-32 h-32 overflow-hidden rounded-lg shadow-lg"}>
                    <img
                        alt={`Image for ${title}`}
                        src={img}
                    />
                </div>
                <div className={"text-left h-32 overflow-scroll"}>
                    <strong className={"text-lg"}>{title}</strong>
                    <div className={(season === undefined || episode === undefined) ? "hidden" : ""}>
                        <p className={"mt-1 italic"}>{season}</p>
                        <FaAngleRight className={"inline ml-0.5"}></FaAngleRight><p className={"text-md inline"}>{episode}</p>
                    </div>
                </div>
            </div>

            <div className={"flex items-center justify-between gap-3"}>
                <p>{formatDuration(timestamp)}</p>
                <Slider
                    aria-label="time-indicator"
                    size="small"
                    value={timestamp}
                    min={0}
                    step={1}
                    max={endTime}
                    onChange={(_, value) => onSetTimestamp(value)}
                    sx={dark ? (_) => ({
                        color: 'rgba(255, 255, 255,0.87)',
                        height: 4,
                    }) : (_) => ({
                        color: 'rgba(0,0,0,0.87)',
                        height: 4,
                    })}
                />
                <p>{formatDuration(endTime)}</p>
            </div>
            <div className={"flex justify-center gap-7 my-4"}>
                <FaBackward className={"w-8 h-8 cursor-pointer"} onClick={backClick}></FaBackward>
                <FaPlay className={isResumed ? "hidden" : "w-8 h-8 cursor-pointer"} onClick={pausePlayClick}></FaPlay>
                <FaPause className={!isResumed ? "hidden" : "w-8 h-8 cursor-pointer"} onClick={pausePlayClick}></FaPause>
                <FaForward className={"w-8 h-8 cursor-pointer"} onClick={forwardClick}></FaForward>
            </div>
            <div className={"flex items-center justify-between gap-3"}>
                <FaVolumeDown className={"m-2"}/>
                <Slider
                    aria-label="Volume"
                    defaultValue={volume}
                    onChange={(_, value) => onSetVolume(value)}
                    min={0}
                    step={5}
                    max={100}
                    sx={dark ? ((_) => ({
                        color: 'rgba(255,255,255,0.87)',
                        '& .MuiSlider-track': {
                            border: 'none',
                        },
                        '& .MuiSlider-thumb': {
                            width: 24,
                            height: 24,
                            backgroundColor: '#bfbfbf',
                            '&::before': {
                                boxShadow: '0 4px 8px rgba(0,0,0,0.4)',
                            },
                            '&:hover, &.Mui-focusVisible, &.Mui-active': {
                                boxShadow: 'none',
                            },
                        },
                    })) : ((_) => ({
                        color: 'rgba(0,0,0,0.87)',
                        '& .MuiSlider-track': {
                            border: 'none',
                        },
                        '& .MuiSlider-thumb': {
                            width: 24,
                            height: 24,
                            backgroundColor: '#fff',
                            '&::before': {
                                boxShadow: '0 4px 8px rgba(0,0,0,0.4)',
                            },
                            '&:hover, &.Mui-focusVisible, &.Mui-active': {
                                boxShadow: 'none',
                            },
                        },
                    }))}
                />
                <div className={!hasSub ? "hidden" : (dark ? "z-10 w-12 h-fit ml-3 bg-dark-primary-on p-1 rounded cursor-pointer drop-shadow-md shadow-dark-shadow" : "z-10 w-fit h-fit ml-3 bg-primary-on p-1 rounded cursor-pointer drop-shadow-md")} onClick={subClick}>
                    <MdOutlineSubtitles className={"w-8 h-8"} />
                </div>
            </div>
        </Container>
    );
}