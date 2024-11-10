import {HashLink} from "react-router-hash-link";

const HomePage = ({children, dark, showPlayer}) => {
    return (
        <div className={dark ? "text-dark-surface-on" : "text-surface-on"}>
            <div className={!showPlayer ? "hidden" : ""}>
                {children}
            </div>
            {/*  Info component - displayed if !isPlaying */}
            <div className={showPlayer ? "hidden" : ""}>
                <div className={dark ? "bg-dark-surface rounded-lg px-6 py-8 shadow-xl shadow-dark-shadow w-11/12 mx-auto mt-10 flex flex-col items-start gap-4" : "bg-surface rounded-lg px-6 py-8 shadow-xl w-11/12 mx-auto mt-10 flex flex-col items-start gap-4"}>
                    <p className={"text-left text-2xl sm:text-4xl"}> Nothing currently playing... </p>
                    <p className={"text-left text-xl sm:text-2xl"}>
                        Go to <span className={dark? "text-dark-primary underline" : "text-primary underline"}><HashLink to="/library">library</HashLink></span> to select something to play
                        or to <span className={dark? "text-dark-primary underline" : "text-primary underline"}><HashLink to="/search">search</HashLink></span> to add something to your library
                    </p>
                </div>
            </div>
        </div>
    )
}

export default HomePage;