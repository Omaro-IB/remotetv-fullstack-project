import {useEffect, useState} from "react";
import services from "../services.js";

const ScanPage = ({dark, displayMessage}) => {
    const [scanErrors, setScanErrors] = useState([]);
    const [scanWarnings, setScanWarnings] = useState([]);

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
        services.rescanScanner().catch(err => {
            console.log(err)
            displayMessage("Error rescaning", -1)
        })
    }

    return (
        <div className={dark ? "text-dark-surface-on" : "text-surface-on"}>
            <button onClick={onRescanClick}>Rescan Library</button>

            <h1>Errors</h1>
            {scanErrors.map((e, i) => (
                <div key={i}>
                    <p>{e}</p>
                </div>
            ))}

            <h1>Warnings</h1>
            {scanWarnings.map((w, i) => (
                <div key={i}>
                    <p>{w}</p>
                </div>
            ))}
        </div>
    )
}

export default ScanPage;