import React, {useEffect, useState} from "react";
import services from "../services.js"
import { IoMdDownload } from "react-icons/io";
import CircularProgress from '@mui/material/CircularProgress';
import { red } from '@mui/material/colors';
import {HashLink} from "react-router-hash-link";

const SearchPage = ({dark, displayMessage}) => {
    const [plugins, setPlugins] = useState([])
    const [selectedPlugin, setSelectedPlugin] = useState(undefined)
    const [search, setSearch] = useState('')
    const [results, setResults] = useState(undefined)
    const [loadingStatus, setLoadingStatus] = useState(0)  // 0 = nothing loading, 1 = loading, 2 = done, 3 = error

    // Refresh data
    const refreshData = () => {
        services.getPlugins().then(data => {
            setPlugins(data)
        }).catch(() => displayMessage("Error getting plugin data from server", -1))
    }
    useEffect(refreshData, []);  // refresh on first render

    return (
        <div>
            {/* Select plugin */}
            <div className={"flex flex-row items-center mt-10 px-1"}>
                <p className={dark ? "ml-auto mr-5 text-dark-surface-on sm:text-2xl" : "ml-auto mr-5 text-surface-on sm:text-2xl"}>Select
                    Source:</p>
                <div
                    className={dark ? "w-7/12 h-24 shadow-lg shadow-dark-shadow border-outline bg-dark-surface mr-auto p-2" : "w-7/12 h-24 shadow-lg border-outline bg-surface mr-auto p-2"}>
                    <div className={"flex flex-row overflow-x-scroll mt-3"}>
                        {plugins.map((plugin) => (
                            <div key={plugin} onClick={() => {
                                if (plugin === selectedPlugin) {
                                    setSelectedPlugin(undefined)
                                } else {
                                    setSelectedPlugin(plugin)
                                }
                            }}
                                 className={dark && selectedPlugin === plugin ? "bg-dark-secondary rounded-md p-2 shadow-2xl shadow-dark-shadow text-dark-secondary-on mr-3" : (dark && selectedPlugin !== plugin ? "bg-dark-primary rounded-md p-2 shadow-2xl shadow-dark-shadow text-dark-primary-on mr-3" : (selectedPlugin === plugin ? "bg-secondary rounded-md p-2 shadow-2xl text-secondary-on mr-3" : "bg-primary rounded-md p-2 shadow-2xl shadow-dark-shadow text-primary-on mr-3"))}>
                                <div className={"flex flex-row hover:cursor-pointer"}>
                                    <p className={"my-auto mr-2 font-bold max-w-24"}>{plugin}</p>
                                    <img className={"h-12 max-w-40 overflow-clip"} alt={`${plugin} Thumbnail`}
                                         src={services.pluginThumbnail(plugin)}/>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/*  Search  */}
            <div className={(selectedPlugin === undefined) ? "hidden" : "mt-10 px-1 mx-auto"}>
                <form className={"mr-auto flex flex-row space-x-5 w-8/12 mx-auto"}>
                    <p className={dark ? "text-dark-surface-on sm:text-2xl w-3/12" : "text-surface-on sm:text-2xl w-3/12"}>{`${selectedPlugin} Search:`}</p>
                    <input
                        className={dark ? "w-full h-10 shadow-lg shadow-dark-shadow border-dark-outline bg-dark-surface p-2 text-dark-surface-on" : "w-full h-10 shadow-lg border-outline bg-surface p-2 text-surface-on"}
                        placeholder={"Search"}
                        value={search} onChange={(e) => {
                        setSearch(e.target.value)
                    }}></input>
                    <button
                        className={dark ? "ml-5 bg-dark-primary p-2 rounded-md text-dark-primary-on" : "ml-5 bg-primary p-2 rounded-md text-primary-on"}
                        type="submit" onClick={(e) => {
                        e.preventDefault()
                        if (search.length > 0) {
                            services.searchPlugin(selectedPlugin, search).then(results => {
                                setLoadingStatus(0)
                                setResults(results)
                            })
                        }
                    }
                    }>Submit
                    </button>
                </form>
            </div>

            {/*  Results */}
            <div className={(results === undefined) ? "hidden" : "mt-10 px-1 mx-auto flex flex-row w-9/12"}>
                <p className={dark ? "text-dark-surface-on sm:text-2xl w-3/12" : "text-surface-on sm:text-2xl w-3/12"}>Select:</p>
                <div>
                    {(results === undefined || loadingStatus !== 0) ? ([]) : results.map(result => (
                        <div
                            className={dark ? "flex flex-row items-center space-x-5 justify-between hover:border-2 border-dark-primary p-1 cursor-pointer" : "flex flex-row items-center space-x-5 justify-between hover:border-2 border-primary p-1 cursor-pointer"}
                            onClick={() => {
                                setLoadingStatus(1);
                                services.downloadPlugin(selectedPlugin, result.source).then(() => {
                                    setLoadingStatus(2)
                                }).catch(() => {
                                    setLoadingStatus(3)
                                }).finally(() => {
                                    setResults(undefined)
                                })
                            }}>
                            <p className={dark ? "text-dark-surface-on text-left" : "text-surface-on text-left"}
                               key={result.source}>{result.label} &nbsp; (from {result.source})</p>
                            <IoMdDownload className={dark ? "fill-dark-surface-on" : ""}/>
                        </div>
                    ))}
                </div>
            </div>

            <div className={loadingStatus !== 1 ? "hidden" : "mt-10 px-1 mx-auto"}>
                <CircularProgress style={{'color': dark ? '#D0BCFF' : '#6750A4'}}/>
            </div>
            <div className={loadingStatus !== 2 ? "hidden" : "mt-10 px-1 mx-auto"}>
                <p className={dark ? "text-dark-surface-on" : "text-surface-on"}>
                    Done! Go to <span className={dark ? "text-dark-primary underline" : "text-primary underline"}><HashLink
                    to="/library">library</HashLink></span> to select something to play
                </p>
            </div>
            <div className={loadingStatus !== 3 ? "hidden" : "mt-10 px-1 mx-auto"}>
                <p className={dark ? "text-dark-error" : "text-error"}>An error occurred while downloading the file</p>
            </div>

        </div>
    )
}

export default SearchPage;