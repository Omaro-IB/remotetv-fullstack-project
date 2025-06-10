import { FaCalendarAlt } from "react-icons/fa";
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

    // Refresh data
    const refreshData = () => {
        services.getLibrary().then(data => {
            setLib(data)
        }).catch(() => displayMessage("Error getting library data from server", -1))
    }
    useEffect(refreshData, []);  // refresh on first render

    return (
        <div>
            <div className="flex flex-wrap mt-3 p-4">  {/* Project boxes div */}
                {(lib.length === 0) ? (<div className={dark ? "text-dark-surface-on" : "text-surface-on"}>
                    Nothing here yet.
                </div>) : lib.map((media, mediaIndex) => {
                    // Media must have name
                    if (media.name === undefined) {return <div></div>}

                    // Metadata depending on collection (use first group/item) or single
                    let image; let release; let quality; let language; let details; let hasSub
                    if ('items' in media) {  // collection
                        image = (media.items[0][0].img === undefined) ? (dark ? 'url(/unknown_img_dark.png)' : 'url(/unknown_img.png)') : `url(${services.getImgUrl(mediaIndex, 0, 0)})`
                        release = media.items[0][0].release
                        quality = media.items[0][0].quality
                        language = media.items[0][0].language
                        details = media.items[0][0].text
                        hasSub = media.items[0][0].sub !== undefined
                    } else { // single
                        image = (media.item.img === undefined) ? (dark ? 'url(/unknown_img_dark.png)' : 'url(/unknown_img.png)') : `url(${services.getImgUrl(mediaIndex)})`
                        release = media.item.release
                        quality = media.item.quality
                        language = media.item.language
                        details = media.item.text
                        hasSub = media.item.sub !== undefined
                    }

                    return(<div key={media.id} style={{backgroundImage: image}} className={dark ? "m-3 bg-cover bg-center bg-no-repeat sm:w-[23%] sm:h-[350px] shadow-2xl shadow-dark-shadow rounded" : "m-3 bg-cover bg-center bg-no-repeat sm:w-[23%] sm:h-[350px] shadow-xl rounded"}>

                        {/* Media display */}
                        <div className={"flex flex-col mx-5 mt-5"}>
                            <div className={dark? "flex flex-row justify-evenly bg-dark-surface-trans" : "flex flex-row justify-evenly bg-surface-trans"}>
                                {/* Media name */}
                                <strong className={dark ? "text-3xl text-left h-fit text-dark-surface-on overflow-auto" : "text-3xl text-left h-fit text-surface-on overflow-auto"}>{media.name}</strong>

                                {/* Release, quality, and language */}
                                <div className={dark ? "text-lg text-left h-fit text-dark-surface-on" : "text-lg text-left h-fit text-surface-on"}>
                                    <div className={(release === undefined) ? "hidden" : "flex flex-1 items-center space-x-1"}>
                                        <FaCalendarAlt/>
                                        <p>{release}</p>
                                    </div>
                                    <div className={(quality === undefined) ? "hidden" : "flex flex-1 items-center space-x-1"}>
                                        <LuSettings2/>
                                        <p>{quality}</p>
                                    </div>
                                    <div className={(language === undefined) ? "hidden" : "flex flex-1 items-center space-x-1"}>
                                        <IoLanguageSharp/>
                                        <p>{language}</p>
                                    </div>
                                    <div className={(!hasSub) ? "hidden" : "flex flex-1 items-center space-x-1"}>
                                        <MdOutlineSubtitles className={(hasSub ? "" : "hidden")} />
                                        <p>subs</p>
                                    </div>
                                </div>
                            </div>

                            {/* Details (text) */}
                            <strong className={dark ? "bg-dark-surface-trans text-dark-surface-on h-24 overflow-auto text-left p-2" : "bg-surface-trans text-surface-on h-24 overflow-auto text-left p-2"}>{details}</strong>
                        </div>

                        {/* Button for single (play) or collection (select to play) */}
                        <div className={"flex flex-1 w-full justify-end pr-5"}>
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
            <div className={(collection === undefined) ? "hidden" : "absolute top-0 left-0 w-fit h-full justify-center flex"}>
            <div className={"flex sticky top-10 justify-center h-fit"}>
                <div className={dark ? "bg-dark-surface text-dark-surface-on p-5 rounded-lg shadow-2xl w-7/12 sm:w-1/4 shadow-dark-shadow" : "bg-surface text-surface-on p-5 rounded-lg shadow-2xl w-7/12 sm:w-1/4"}>
                    <FaXmark className={dark ? "fill-dark-primary w-7 h-7 cursor-pointer mb-5" : "fill-primary w-7 h-7 cursor-pointer mb-5"} onClick={() => setCollection(undefined)}/>
                    {/*<p>{JSON.stringify(episodes)}</p>*/}
                    <div className={"flex flex-col overflow-scroll"}>
                        {(collection === undefined) ? "" : collection.items.map((group, group_index) => (
                            // Group accordion
                            <Accordion key={group_index}>
                                <AccordionSummary expandIcon={<MdExpandMore className={dark? "fill-dark-surface-on" : "fill-surface-on"} />} aria-controls="panel1-content" id="panel1-header" style={dark ? {backgroundColor: "#141218"} : {backgroundColor: "#FEF7FF"}}>
                                    <p className={dark? "text-dark-surface-on" : "text-surface-on"}>{`${collection.group_labels[group_index]}`}</p>
                                </AccordionSummary>
                                <AccordionDetails className={dark? "bg-dark-surface text-dark-surface-on" : "bg-surface text-surface-on"}>
                                    {group.map(((item, item_index) => (
                                        // Item button
                                        <button key={item_index} onClick={() => services.playByID(`${ID},${group_index},${item_index}`).then(() => navigate("/")).catch(() => displayMessage("Error playing this media", 2000))} className={dark ? "bg-dark-primary-container w-fit p-1 mx-1 text-dark-primary-container-on rounded drop-shadow-md shadow-dark-shadow" : "bg-primary-container w-fit p-1 mx-1 text-primary-container-on rounded drop-shadow-md"}>
                                            {`${collection.item_labels[group_index][item_index]}`}
                                        </button>
                                    )))}
                                </AccordionDetails>
                            </Accordion>
                        ))}
                    </div>
                </div>
            </div>
            </div>
        </div>
    )
}

export default LibraryPage;