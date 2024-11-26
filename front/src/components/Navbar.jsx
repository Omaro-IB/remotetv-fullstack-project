import { FaInfoCircle, FaMoon, FaSun } from "react-icons/fa";
import { FaXmark } from "react-icons/fa6";
import React, { useState } from 'react';
import {HashLink} from "react-router-hash-link";


const NavbarLink = ({dark, strikethrough, text}) => (
    <div className={dark? "text-xl text-dark-surface-on": "text-xl text-surface-on"}>
        <p className={strikethrough? "line-through": "hidden"}>{text}</p>
        <p className={!strikethrough? "underline": "hidden"}>{text}</p>
    </div>
)

const Navbar = ({dark, page, toggleDark}) => {
    const [displayInfo, setDisplayInfo] = useState(false);

    return (<div className={dark ? "bg-dark-primary-container flex flex-row justify-between sm:justify-start sm:space-x-10 py-5 px-10" : "bg-primary-container flex flex-row justify-between sm:justify-start sm:space-x-10 py-5 px-10 ring-slate-900/5 shadow-md"}>
        <button onClick={() => setDisplayInfo(true)}>
            <FaInfoCircle className={dark ? "w-5 h-5 fill-dark-surface-on" : "w-5 h-5 fill-surface-on"}/>
        </button>
        <button onClick={toggleDark}>
            <FaSun className={!dark ? "hidden" : "w-5 h-5 fill-dark-surface-on"}></FaSun>
            <FaMoon className={dark ? "hidden" : "w-5 h-5 fill-surface-on"}></FaMoon>
        </button>
        <HashLink to="/"><NavbarLink dark={dark} strikethrough={page === "Home"}
                                     text={"TV Remote"}></NavbarLink></HashLink>
        <HashLink to="/library"><NavbarLink dark={dark} strikethrough={page === "Library"}
                                            text={"Library"}></NavbarLink></HashLink>
        <HashLink to="/search"><NavbarLink dark={dark} strikethrough={page === "Search"}
                                           text={"Search"}></NavbarLink></HashLink>

        {/* Information screen */}
        <div className={displayInfo ? "absolute top-0 right-0 w-screen h-screen z-50" : "hidden"}>
            <div
                className={dark ? "bg-dark-surface-trans2 items-center justify-center w-full h-full text-dark-surface-on p-5 overflow-scroll" : "bg-surface-trans2 items-center justify-center w-full h-full p-5 overflow-scroll"}>
                <FaXmark className={dark ? "fill-dark-surface-on w-10 h-10 cursor-pointer" : "w-10 h-10 cursor-pointer"} onClick={() => setDisplayInfo(false)}/>
                <div>
                    <h1 className={"text-4xl font-bold"}>Info</h1>
                    <div className={"mt-2 text-left sm:mx-10 text-xl sm:text-2xl"}>
                        <h2 className={"text-3xl font-bold"}>What is this?</h2>
                        <p>This is a minimalistic smart TV alternative with large extensibility support, with an emphasis on performance, security, and privacy.</p>
                        <p>The idea is to self-host both the backend (to handle media playback) and frontend (this web app) on the same device that is hooked up to your TV.</p>
                        <p><a href="https://mpv.io/" className={dark? "text-dark-primary underline" : "text-primary underline"}>MPV</a> is used for all the media playback since it has extensive scripting support, and strives for the same minimalism as this app.</p>
                        <h2 className={"text-3xl font-bold mt-4"}>But why?</h2>
                        <p>Instead of dealing with clunky TV interfaces, you can fully control everything from your phone, tablet, or laptop right from your browser - no app install or anything necessary. </p>
                        <p>Multiple people can control the TV at the same time, and only need to be connected to your home network.</p>
                        <h2 className={"text-3xl font-bold mt-4"}>Source Code / Report Bugs</h2>
                        <a href="https://github.com/Omaro-IB/remotetv-fullstack-project" className={dark? "text-dark-primary underline" : "text-primary underline"}>https://github.com/Omaro-IB/remotetv-fullstack-project</a>
                        <p className={"mt-10 opacity-70"}> Copyright © {new Date().getFullYear()} Free Software Foundation, Inc. https://fsf.org/</p>
                    </div>
                </div>
            </div>
        </div>
    </div>)
}

export default Navbar;