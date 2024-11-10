import { FaCalendarAlt } from "react-icons/fa";
import { LuSettings2 } from "react-icons/lu";
import { IoLanguageSharp } from "react-icons/io5";
import services from "../services.js"
import React, { useEffect, useState } from 'react';
import {useNavigate} from "react-router-dom";

const LibraryPage = ({dark, playCallback, errorCallback1, errorCallback2}) => {
    const navigate = useNavigate()
    const [boxes, setBoxes] = useState([])

    // Refresh data
    const refreshData = () => {
        services.getLibrary().then(data => {
            setBoxes(data)
        }).catch(errorCallback1)
    }
    useEffect(refreshData, []);  // refresh on first render

    return (
        <div>
            <div className="flex flex-wrap mt-3 p-4">  {/* Project boxes div */}
                {boxes.map((box) => (
                    <div key={box.id} style={{backgroundImage: `url(${box.metadata.image})`}}
                         className={dark ? "m-3 bg-cover bg-center bg-no-repeat sm:w-[23%] sm:h-[350px] shadow-2xl shadow-dark-shadow rounded" : "m-3 bg-cover bg-center bg-no-repeat sm:w-[23%] sm:h-[350px] shadow-xl rounded"}>
                        <div className={"flex flex-col mx-5 mt-5"}>
                            <div className={dark? "flex flex-row justify-evenly bg-dark-surface-trans" : "flex flex-row justify-evenly bg-surface-trans"}>
                                <strong
                                    className={dark ? "text-3xl text-left h-fit text-dark-surface-on overflow-auto" : "text-3xl text-left h-fit text-surface-on overflow-auto"}>{box.metadata.title}</strong>
                                <div className={dark ? "text-lg text-left h-fit text-dark-surface-on" : "text-lg text-left h-fit text-surface-on"}>
                                    <div className={"flex flex-1 items-center space-x-1"}>
                                        <FaCalendarAlt/>
                                        <p>{box.metadata.release}</p>
                                    </div>
                                    <div className={"flex flex-1 items-center space-x-1"}>
                                        <LuSettings2/>
                                        <p>{box.metadata.quality}</p>
                                    </div>
                                    <div className={"flex flex-1 items-center space-x-1"}>
                                        <IoLanguageSharp/>
                                        <p>{box.metadata.language}</p>
                                    </div>
                                </div>
                            </div>
                            <strong className={dark ? "bg-dark-surface-trans text-dark-surface-on h-24 overflow-auto" : "bg-surface-trans text-surface-on h-24 overflow-auto"}>{box.metadata.details}</strong>
                        </div>
                        <div className={"flex flex-1 w-full justify-end pr-5"}>
                            <button onClick={() => services.playByID(box.id).then(() => {{playCallback(); navigate("/")}}).catch(errorCallback2)}
                                className={dark ? "bg-dark-primary-container w-fit my-2 p-3 text-lg text-dark-primary-container-on rounded drop-shadow-2xl" : "bg-primary-container w-fit my-2 p-3 text-lg text-primary-container-on rounded drop-shadow-2xl"}>
                                <p className={!(box.metadata.type === "tv") ? "hidden" : ""}>Select Episode</p>
                                <p className={((box.metadata.type === "tv")) ? "hidden" : ""}>Play from Start</p>
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default LibraryPage;