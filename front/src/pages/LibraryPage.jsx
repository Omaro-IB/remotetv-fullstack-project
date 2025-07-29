import { FaCalendarAlt, FaSearch } from "react-icons/fa";
import { LuSettings2 } from "react-icons/lu";
import { IoLanguageSharp } from "react-icons/io5";
import services from "../services.js"
import React, { useEffect, useState } from 'react';
import {useNavigate} from "react-router-dom";
import { FaXmark } from "react-icons/fa6";
import {Accordion, AccordionDetails, AccordionSummary} from "@mui/material";
import { MdExpandMore, MdOutlineSubtitles } from "react-icons/md";

const LibraryPage = ({dark, displayMessage}) => {
    const navigate = useNavigate()
    const [lib, setLib] = useState([])
    const [collection, setCollection] = useState(undefined)
    const [ID, setID] = useState(-1)
    const [filter, setFilter] = useState('')

    // Refresh data
    const refreshData = () => {
        services.getLibrary().then(data => {
            setLib(data)
        }).catch(() => displayMessage("Error getting library data from server", -1))
    }
    useEffect(refreshData, []);  // refresh on first render

    return (
        <div>
            {/* Search box */}
            <div className={"flex flex-row w-full justify-center items-center mt-4"}>
                <FaSearch className={dark ? "mx-2 w-5 h-5 fill-dark-surface-on" : "mx-2 w-5 h-5"} />
                <input className={dark ? "bg-dark-surface h-8 text-lg text-dark-surface-on p-2" : "h-8 text-lg p-2"} value={filter} onChange={e => setFilter(e.target.value)} type={"text"} placeholder={"Search library"}/>
            </div>

            {/* Project boxes div */}
            <div className="flex flex-wrap mt-4 justify-center">
                {(lib.length === 0) ? (<div className={dark ? "text-dark-surface-on" : "text-surface-on"}>
                    Nothing here yet.
                </div>) : lib.map((media, mediaIndex) => {
                    // Media must have name
                    if (media.name === undefined) {return <div></div>}
                    const parsedName = services.parseMediaFilename(media.name)
                    const name = parsedName["name"]

                    // If filter is active, only display if matching filter
                    if (filter !== '' && !(name.toLowerCase().includes(filter.toLowerCase()))) {return <div></div>}

                    // Metadata depending on collection (use first group/item) or single
                    let image; let release; let quality; let language; let details; let hasSub
                    if ('items' in media) {  // collection
                        image = media.global_img === undefined ? ((media.items[0][0].img === undefined) ? undefined : `url(${services.getImgUrl(mediaIndex, 0, 0)})`) : `url(${services.getImgUrl(mediaIndex)})`
                        release = media.global_release || media.items[0][0].release
                        quality = media.global_quality || media.items[0][0].quality
                        language = media.global_language || media.items[0][0].language
                        details = media.global_text || media.items[0][0].text
                        hasSub = media.items[0][0].sub !== undefined
                    } else { // single
                        image = (media.item.img === undefined) ? undefined : `url(${services.getImgUrl(mediaIndex)})`
                        release = media.item.release
                        quality = media.item.quality
                        language = media.item.language
                        details = media.item.text
                        hasSub = media.item.sub !== undefined
                    }

                    // Get more info from filename
                    if (release === undefined) {release = parsedName["release"]}
                    if (quality === undefined) {quality = parsedName["quality"]}

                    const box_style = `flex flex-col my-3 sm:mx-4 bg-cover bg-center bg-no-repeat w-[90%] sm:w-1/5 shadow-2xl ${dark ? "shadow-dark-shadow" : ""} rounded`

                    return(<div key={mediaIndex} style={{backgroundImage: image}} className={box_style}>

                        <div className={dark ? "flex flex-row justify-evenly m-5 bg-dark-surface-trans h-full max-h-72" : "flex flex-row justify-evenly m-5 bg-surface-trans h-full max-h-72"}>

                            {/* Media name and details */}
                            <div className={"overflow-auto flex flex-col w-full h-full"}>
                                <strong className={dark ? "text-3xl text-left h-fit text-dark-surface-on" : "text-3xl text-left h-fit text-surface-on"}>{name}</strong>
                                <strong className={dark ? "text-dark-surface-on h-fit text-left p-2" : "text-surface-on h-fit text-left p-2"}>{details}</strong>
                            </div>

                            {/* Release, quality, language, and subs */}
                            <div className={dark ? "flex flex-col h-full w-fit text-lg ml-2 overflow-clip text-dark-surface-on" : "flex flex-col h-full w-fit text-lg ml-2 overflow-clip text-surface-on"}>
                                <div className={release === undefined ? "hidden" : "w-[67px] h-8 flex flex-row items-center"}>
                                    <FaCalendarAlt className={"w-4 h-4"} />
                                    <p className={"w-12"}>{release}</p>
                                </div>
                                <div className={quality === undefined ? "hidden" : "w-[67px] h-8 flex flex-row items-center"}>
                                    <LuSettings2 className={"w-4 h-4"} />
                                    <p className={"w-12"}>{quality}</p>
                                </div>
                                <div className={language === undefined ? "hidden" : "w-[67px] h-8 flex flex-row items-center"}>
                                    <IoLanguageSharp className={"w-4 h-4"} />
                                    <p className={"w-12"}>{language}</p>
                                </div>
                                <div className={!hasSub ? "hidden" : "w-[67px] h-8 flex flex-row items-center"}>
                                    <MdOutlineSubtitles className={"w-4 h-4"} />
                                    <p className={"w-12"}>subs</p>
                                </div>
                            </div>
                        </div>

                        {/* Button for single (play) or collection (select to play) */}
                        <div className={"h-fit w-full mt-auto mb-2 pr-5"}>
                            <button onClick={
                                    ('items' in media) ?
                                    (() => {setCollection(media); setID(mediaIndex)}) :
                                    (() => services.playByID(`${mediaIndex}`).then(() => navigate("/")).catch(() => displayMessage("Error playing this media", 2000)))}
                                    className={dark ? "bg-dark-primary-container w-fit my-2 p-3 text-lg text-dark-primary-container-on rounded drop-shadow-2xl" : "bg-primary-container w-fit my-2 p-3 text-lg text-primary-container-on rounded drop-shadow-2xl"}>
                                <p className={!('items' in media) ? "hidden" : ""}>Select to play</p>
                                <p className={('items' in media) ? "hidden" : ""}>Play from Start</p>
                            </button>
                        </div>
                    </div>
                )}
                )}
            </div>

            {/* Collection selector */}
            <div className={(collection === undefined ? "hidden" : "absolute top-0 left-0 w-full h-full")}>
                <div className={dark ? "sticky top-10 mx-auto bg-dark-surface p-5 rounded-lg shadow-2xl shadow-dark-shadow w-5/6 sm:w-1/3 min-h-20 max-h-[90vh] h-fit overflow-auto" : "sticky top-10 mx-auto bg-surface p-5 rounded-lg shadow-2xl w-5/6 sm:w-1/3 min-h-20 max-h-[90vh] h-fit overflow-auto"}>
                    {/* Close selector */}
                    <div className={"w-7 h-7 mb-5"}>
                        <button onClick={() => setCollection(undefined)}>
                            <FaXmark className={dark ? "fill-dark-primary w-7 h-7" : "fill-primary w-7 h-7"}/>
                        </button>
                    </div>
                    {/* Selector */}
                    <div className={"flex flex-col overflow-scroll"}>
                        {(collection === undefined) ? "" : collection.items.map((group, group_index) => (
                            // Group accordion
                            <Accordion key={group_index}>
                                <AccordionSummary expandIcon={<MdExpandMore
                                    className={dark ? "fill-dark-surface-on" : "fill-surface-on"}/>}
                                                  aria-controls="panel1-content" id="panel1-header"
                                                  style={dark ? {backgroundColor: "#141218"} : {backgroundColor: "#FEF7FF"}}>
                                    <p className={dark ? "text-dark-surface-on" : "text-surface-on"}>{`${collection.group_labels[group_index]}`}</p>
                                </AccordionSummary>
                                <AccordionDetails
                                    className={dark ? "bg-dark-surface text-dark-surface-on" : "bg-surface text-surface-on"}>
                                    {group.map(((item, item_index) => (
                                        // Item button
                                        <button key={item_index}
                                                onClick={() => services.playByID(`${ID},${group_index},${item_index}`).then(() => navigate("/")).catch(() => displayMessage("Error playing this media", 2000))} className={dark ? "bg-dark-primary-container w-fit p-1 mx-1 text-dark-primary-container-on rounded drop-shadow-md shadow-dark-shadow" : "bg-primary-container w-fit p-1 mx-1 text-primary-container-on rounded drop-shadow-md"}>
                                            {`${services.formatEpisodeString(collection.item_labels[group_index][item_index])}`}
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