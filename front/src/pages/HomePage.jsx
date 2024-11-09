import {FaPause, FaPlay, FaStop, FaForward, FaBackward, FaVolumeDown} from "react-icons/fa";
import {FaBackwardStep, FaForwardStep} from "react-icons/fa6";
import { ImVolumeDecrease, ImVolumeIncrease } from "react-icons/im";

const HomePage = ({dark, isPlaying, timestamp, endTime, volume, isResumed, img, title, pausePlayClick, stopClick, backClick, skipBackClick, forwardClick, skipForwardClick, volumeUpClick, volumeDownClick}) => {
    return (
        <div className={dark ? "text-dark-surface-on" : "text-surface-on"}>
            {/*Media Player - displayed if isPlaying*/}
            <div className={!isPlaying ? "hidden" : ""}>
                <div className={dark ? "bg-dark-surface rounded-lg px-6 py-8 shadow-xl shadow-dark-shadow w-11/12 mx-auto mt-10 flex flex-col sm:flex-row" : "bg-surface rounded-lg px-6 py-8 shadow-xl w-11/12 mx-auto mt-10 flex flex-col sm:flex-row"}>
                    {/*Image*/}
                    <div className={"sm:w-[35rem] border-2 border-primary rounded shadow-xl"}>
                        <img src={img} alt={`${title} Poster`}/>
                    </div>
                    {/*Title & Controls*/}
                    <div className={dark ? "flex flex-col text-dark-surface-on sm:w-[35rem] sm:ml-10" : "flex flex-col text-surface-on sm:w-[35rem] sm:ml-10"}>
                        <p className={"mt-10 sm:mt-0 text-2xl sm:text-4xl"}>{title}</p>
                        <div className={"flex flex-row justify-center sm:justify-between mt-5 w-64 mx-auto space-x-2"}>
                            {/* pause/play button */}
                            <button onClick={pausePlayClick}
                                    className={dark ? "bg-dark-primary px-8 py-2 rounded-2xl drop-shadow-lg shadow-dark-shadow" : "bg-primary px-8 py-2 rounded-2xl drop-shadow-lg"}>
                                <div className={!isResumed ? "hidden" : "w-5 h-5 sm:w-10 sm:h-10 mx-auto"}>
                                    <FaPause className={dark ? "w-5 h-5 m-auto sm:w-10 sm:h-10 fill-dark-primary-on" : "w-5 h-5 m-auto sm:w-10 sm:h-10 fill-primary-on"}/>
                                </div>
                                <div className={isResumed ? "hidden" : "w-5 h-5 sm:w-10 sm:h-10 mx-auto"}>
                                    <FaPlay className={dark ? "w-5 h-5 m-auto sm:w-10 sm:h-10 fill-dark-primary-on" : "w-5 h-5 m-auto sm:w-10 sm:h-10 fill-primary-on"}/>
                                </div>
                            </button>
                            {/* stop button */}
                            <button onClick={stopClick} className={dark ? "bg-dark-primary px-8 rounded-2xl drop-shadow-lg shadow-dark-shadow" : "bg-primary px-8 rounded-2xl drop-shadow-lg"}>
                                <FaStop className={dark ? "w-5 h-5 m-auto sm:w-10 sm:h-10 fill-dark-primary-on" : "w-5 h-5 m-auto sm:w-10 sm:h-10 fill-primary-on"}/>
                            </button>
                            {/*  volume controls  */}
                            <div className={"flex flex-col justify-evenly"}>
                                <button onClick={volumeUpClick} className={dark ? "bg-dark-primary p-2 my-1 rounded-2xl drop-shadow-lg shadow-dark-shadow" : "bg-primary p-2 my-1 rounded-2xl drop-shadow-lg"}>
                                    <ImVolumeIncrease className={dark ? "w-5 h-5 m-auto sm:w-10 sm:h-10 fill-dark-primary-on" : "w-5 h-5 m-auto sm:w-10 sm:h-10 fill-primary-on"}/>
                                </button>
                                <button onClick={volumeDownClick} className={dark ? "bg-dark-primary p-2 my-1 rounded-2xl drop-shadow-lg shadow-dark-shadow" : "bg-primary p-2 my-1 rounded-2xl drop-shadow-lg"}>
                                    <ImVolumeDecrease className={dark ? "w-5 h-5 m-auto sm:w-10 sm:h-10 fill-dark-primary-on" : "w-5 h-5 m-auto sm:w-10 sm:h-10 fill-primary-on"}/>
                                </button>
                            </div>
                        </div>
                        <div className={"flex flex-row justify-center sm:justify-between mt-4 w-64 mx-auto space-x-1"}>
                            {/* skip back button */}
                            <button onClick={skipBackClick} className={dark ? "bg-dark-primary px-4 py-4 rounded-xl drop-shadow-lg shadow-dark-shadow" : "bg-primary px-4 py-4 rounded-xl drop-shadow-lg"}>
                                <FaBackwardStep className={dark ? "w-5 h-5 m-auto fill-dark-primary-on" : "w-5 h-5 m-auto fill-primary-on"}/>
                            </button>
                            {/* back button */}
                            <button onClick={backClick} className={dark ? "bg-dark-primary px-4 py-4 rounded-xl drop-shadow-lg shadow-dark-shadow" : "bg-primary px-4 py-4 rounded-xl drop-shadow-lg"}>
                                <FaBackward className={dark ? "w-5 h-5 m-auto fill-dark-primary-on" : "w-5 h-5 m-auto fill-primary-on"}/>
                            </button>
                            {/* forward button */}
                            <button onClick={forwardClick} className={dark ? "bg-dark-primary px-4 py-4 rounded-xl drop-shadow-lg shadow-dark-shadow" : "bg-primary px-4 py-4 rounded-xl drop-shadow-lg"}>
                                <FaForward className={dark ? "w-5 h-5 m-auto fill-dark-primary-on" : "w-5 h-5 m-auto fill-primary-on"}/>
                            </button>
                            {/* skip forward button */}
                            <button onClick={skipForwardClick} className={dark ? "bg-dark-primary px-4 py-4 rounded-xl drop-shadow-lg shadow-dark-shadow" : "bg-primary px-4 py-4 rounded-xl drop-shadow-lg"}>
                                <FaForwardStep className={dark ? "w-5 h-5 m-auto fill-dark-primary-on" : "w-5 h-5 m-auto fill-primary-on"}/>
                            </button>
                        </div>
                        {/* Timeline */}
                        <div className={"flex flex-row justify-center mt-10"}>
                            <p>{`${Math.floor(timestamp / 60)}:${Math.round(((timestamp / 60) - (Math.floor(timestamp / 60)))*60)}`}</p>
                            <div className={"self-center h-1 bg-outline mx-4 w-96"}>
                                <div className={"absolute w-[53%] sm:w-[18%]"}>
                                    <div className={"h-1 bg-primary"} style={{width:`${(timestamp / endTime) * 100}%`}}></div>
                                </div>
                            </div>
                            <p>{`${Math.floor(endTime / 60)}:${Math.round(((endTime / 60) - (Math.floor(endTime / 60)))*60)}`}</p>
                        </div>
                        {/*Volume bar*/}
                        <div className={"flex flex-row justify-center mt-4"}>
                            <FaVolumeDown />
                            <div className={"self-center h-1 bg-outline mx-4 w-96"}>
                                <div className={"absolute w-[60%] sm:w-[22%]"}>
                                    <div className={"h-1 bg-primary"}
                                         style={{width: `${volume}%`}}></div>
                                </div>
                            </div>
                            <p>{`${volume}%`}</p>
                        </div>
                    </div>
                </div>
            </div>
            {/*  Info component - displayed if !isPlaying */}
            <div className={isPlaying ? "hidden" : ""}>
                <div className={dark ? "bg-dark-surface rounded-lg px-6 py-8 shadow-xl shadow-dark-shadow w-11/12 mx-auto mt-10 flex flex-col sm:flex-row" : "bg-surface rounded-lg px-6 py-8 shadow-xl w-11/12 mx-auto mt-10 flex flex-col sm:flex-row"}>
                    <p>TODO...</p>
                    <ul className={"text-left"}>
                        <li>* If Something has been played in past week,
                            display its single / series box (depending on
                            what it is)</li>
                        <li>* If nothing was played, some large prompt appears to
                            begin searching or browse library</li>
                    </ul>
                </div>
            </div>
        </div>
    )
}

export default HomePage;