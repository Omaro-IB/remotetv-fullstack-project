import { FaCalendarAlt } from "react-icons/fa";
import { LuSettings2 } from "react-icons/lu";
import { IoLanguageSharp } from "react-icons/io5";
import services from "../services.js"
import React, { useEffect, useState } from 'react';
import {useNavigate} from "react-router-dom";
import { FaXmark } from "react-icons/fa6";
import {Accordion, AccordionDetails, AccordionSummary} from "@mui/material";
import { MdExpandMore } from "react-icons/md";
import {HashLink} from "react-router-hash-link";

const LibraryPage = ({dark, displayMessage}) => {
    const navigate = useNavigate()
    const [boxes, setBoxes] = useState([])
    const [episodes, setEpisodes] = useState(undefined)
    const [ID, setID] = useState(-1)

    // Refresh data
    const refreshData = () => {
        services.getLibrary().then(data => {
            setBoxes(data)
        }).catch(() => displayMessage("Error getting library data from server", -1))
    }
    useEffect(refreshData, []);  // refresh on first render

    return (
        <div>
            <div className="flex flex-wrap mt-3 p-4">  {/* Project boxes div */}
                {(boxes.length === 0) ? (<div className={dark ? "text-dark-surface-on" : "text-surface-on"}>
                    Nothing here yet.
                </div>) : boxes.map((box) => {
                    if (box.id === undefined) {return <div></div>}
                    if (box.metadata === undefined) {return <div></div>}
                    const image = (box.metadata.image === undefined) ? 'url(/unknown_img.png)' : `url(${box.metadata.image})`

                    return(<div key={box.id} style={{backgroundImage: image}}
                         className={dark ? "m-3 bg-cover bg-center bg-no-repeat sm:w-[23%] sm:h-[350px] shadow-2xl shadow-dark-shadow rounded" : "m-3 bg-cover bg-center bg-no-repeat sm:w-[23%] sm:h-[350px] shadow-xl rounded"}>
                        <div className={"flex flex-col mx-5 mt-5"}>
                            <div className={dark? "flex flex-row justify-evenly bg-dark-surface-trans" : "flex flex-row justify-evenly bg-surface-trans"}>
                                <strong
                                    className={dark ? "text-3xl text-left h-fit text-dark-surface-on overflow-auto" : "text-3xl text-left h-fit text-surface-on overflow-auto"}>{box.metadata.title}</strong>
                                <div className={dark ? "text-lg text-left h-fit text-dark-surface-on" : "text-lg text-left h-fit text-surface-on"}>
                                    <div className={(box.metadata.release === undefined) ? "hidden" : "flex flex-1 items-center space-x-1"}>
                                        <FaCalendarAlt/>
                                        <p>{box.metadata.release}</p>
                                    </div>
                                    <div className={(box.metadata.quality === undefined) ? "hidden" : "flex flex-1 items-center space-x-1"}>
                                        <LuSettings2/>
                                        <p>{box.metadata.quality}</p>
                                    </div>
                                    <div className={(box.metadata.language === undefined) ? "hidden" : "flex flex-1 items-center space-x-1"}>
                                        <IoLanguageSharp/>
                                        <p>{box.metadata.language}</p>
                                    </div>
                                </div>
                            </div>
                            <strong className={dark ? "bg-dark-surface-trans text-dark-surface-on h-24 overflow-auto" : "bg-surface-trans text-surface-on h-24 overflow-auto"}>{box.metadata.details}</strong>
                        </div>
                        <div className={"flex flex-1 w-full justify-end pr-5"}>
                            <button onClick={
                                    (box.type === "tv") ?
                                    (() => {setEpisodes(box.episodes); setID(box.id)}) :
                                    (() => services.playByID(box.id).then(() => navigate("/")).catch(() => displayMessage("Error playing this media", 2000)))}
                                    className={dark ? "bg-dark-primary-container w-fit my-2 p-3 text-lg text-dark-primary-container-on rounded drop-shadow-2xl" : "bg-primary-container w-fit my-2 p-3 text-lg text-primary-container-on rounded drop-shadow-2xl"}>
                                <p className={!(box.type === "tv") ? "hidden" : ""}>Select Episode</p>
                                <p className={((box.type === "tv")) ? "hidden" : ""}>Play from Start</p>
                            </button>
                        </div>
                    </div>
                )}
                )}
            </div>
            {/*Episode selector*/}
            <div className={(episodes === undefined) ? "hidden" : "absolute top-40 left-0 w-full justify-center flex"}>
                <div className={dark ? "bg-dark-surface text-dark-surface-on p-5 rounded-lg shadow-2xl w-7/12 sm:w-1/4 shadow-dark-shadow" : "bg-surface text-surface-on p-5 rounded-lg shadow-2xl w-7/12 sm:w-1/4"}>
                    <FaXmark className={dark ? "fill-dark-primary w-7 h-7 cursor-pointer mb-5" : "fill-primary w-7 h-7 cursor-pointer mb-5"} onClick={() => setEpisodes(undefined)}/>
                    {/*<p>{JSON.stringify(episodes)}</p>*/}
                    <div className={"flex flex-col overflow-scroll"}>
                        {(episodes === undefined) ? "" : Object.keys(episodes).map((season) => (
                            <Accordion key={season}>
                                <AccordionSummary expandIcon={<MdExpandMore className={dark? "fill-dark-surface-on" : "fill-surface-on"} />} aria-controls="panel1-content" id="panel1-header" style={dark ? {backgroundColor: "#141218"} : {backgroundColor: "#FEF7FF"}}>
                                    <p className={dark? "text-dark-surface-on" : "text-surface-on"}>{`Season ${season}`}</p>
                                </AccordionSummary>
                                <AccordionDetails className={dark? "bg-dark-surface text-dark-surface-on" : "bg-surface text-surface-on"}>
                                    {Object.keys(episodes[season]).map((episode => (
                                        <button key={episode} onClick={() => services.playTVByID(ID, season, episode).then(() => navigate("/")).catch(() => displayMessage("Error playing this media", 2000))} className={dark ? "bg-dark-primary-container w-fit p-1 mx-1 text-dark-primary-container-on rounded drop-shadow-md shadow-dark-shadow" : "bg-primary-container w-fit p-1 mx-1 text-primary-container-on rounded drop-shadow-md"}>
                                            {`Episode ${episode}`}
                                        </button>
                                    )))}
                                </AccordionDetails>
                            </Accordion>
                        ))}


                    </div>
                </div>
            </div>
        </div>
    )
}

export default LibraryPage;