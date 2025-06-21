import {useEffect, useState} from "react";
import services from "../services.js";
import { MdError, MdWarning } from "react-icons/md";


const TextHighlighter = ({ dark, text, color }) => {
    const first = text.split(']:', 1) + ']:'
    const second = text.substring(first.length)
    let firstStyle
    if (color === "error") {firstStyle = dark ? "text-dark-surface bg-error" : "bg-error"}
    if (color === "warning") {firstStyle = dark ? "text-dark-surface bg-warning" : "bg-warning"}
    return (
        <p>
            <strong className={firstStyle}>{first}</strong>
            <span>{second}</span>
        </p>
    )
}


const ScanPage = ({dark, displayMessage}) => {
    const [scanErrors, setScanErrors] = useState([]);
    const [scanWarnings, setScanWarnings] = useState([]);
    const [displayR, setDisplayR] = useState(false);

    const refreshStatus = () => {
        services.scannerStatus().then(status => {
            setScanErrors(status.data.errors)
            setScanWarnings(status.data.warnings)
        }).catch(err => {
            console.log(err)
            displayMessage("Error getting scanner status from server", -1)
        })
    }
    useEffect(refreshStatus, [])

    const onRescanClick = () => {
        services.rescanScanner().then(_ => setDisplayR(true)).catch(err => {
            console.log(err)
            displayMessage("Error rescaning", -1)
        })
    }

    return (
        <div className={dark ? "text-dark-surface-on" : "text-surface-on"}>
            <div className={"flex flex-1 w-fit mx-auto items-center h-20"}>
                <strong>Click to update library changes: </strong>
                <button className={displayR ? "hidden" : dark ? "bg-dark-primary-container text-dark-primary-container-on rounded-sm shadow-lg shadow-dark-shadow m-4 p-2" : "bg-primary-container text-primary-container-on rounded-sm shadow-lg m-4 p-2"} onClick={onRescanClick}>Rescan Library</button>
                <p className={displayR ? "" : "hidden"}>&nbsp; Rescanned!</p>
            </div>

            <div className={scanErrors.length === 0 ? "hidden" : "flex flex-1 w-fit mx-auto items-center"}>
                <MdError className={"mr-2 fill-error"} />
                <h1 className={"text-2xl"}>{"Errors:"}</h1>
            </div>
            <div>
                {scanErrors.map((e, i) => (
                    <div key={i} className={"my-2 mx-5 text-left"}>
                        <TextHighlighter dark={dark} text={e[0]} color={"error"} />  {/*#B3261E*/}
                    </div>
                ))}
            </div>

            <div className={scanWarnings.length === 0 ? "hidden" : "flex flex-1 w-fit mx-auto items-center mt-4"}>
                <MdWarning className={"mr-2 fill-[#EAC272]"} />
                <h1 className={"text-2xl"}>{"Warnings:"}</h1>
            </div>
            <div>
                {scanWarnings.map((w, i) => (
                    <div key={i} className={"my-2 mx-5 text-left"}>
                        <TextHighlighter dark={dark} text={w[0]} color={"warning"} />  {/*#EAC272*/}
                    </div>
                ))}
            </div>
        </div>
    )
}

export default ScanPage;