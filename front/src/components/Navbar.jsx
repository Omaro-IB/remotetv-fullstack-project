import { FaMoon } from "react-icons/fa";
import { FaSun } from "react-icons/fa";
import { FaInfoCircle } from "react-icons/fa";
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

    return (<div
        className={dark ? "bg-dark-primary-container flex flex-row justify-between sm:justify-start sm:space-x-10 py-5 px-10" : "bg-primary-container flex flex-row justify-between sm:justify-start sm:space-x-10 py-5 px-10 ring-slate-900/5 shadow-md"}>
        <button onClick={() => setDisplayInfo(!displayInfo)}> {/*TODO: make this button go somewhere*/}
            <FaInfoCircle className={dark ? "w-5 h-5 fill-dark-surface-on" : "w-5 h-5 fill-surface-on"}/>
        </button>
        <button onClick={toggleDark}>
            <FaSun className={!dark ? "hidden" : "w-5 h-5 fill-dark-surface-on"}></FaSun>
            <FaMoon className={dark ? "hidden" : "w-5 h-5 fill-surface-on"}></FaMoon>
        </button>
        <HashLink to="/"><NavbarLink dark={dark} strikethrough={page === "Home"} text={"Home"}></NavbarLink></HashLink>
        <HashLink to="/library"><NavbarLink dark={dark} strikethrough={page === "Library"} text={"Library"}></NavbarLink></HashLink>
        <HashLink to="/search"><NavbarLink dark={dark} strikethrough={page === "Search"} text={"Search"}></NavbarLink></HashLink>
    </div>)
}

export default Navbar;