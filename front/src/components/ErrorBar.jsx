const ErrorBar = ({dark, message}) => (
    <div className={dark? "bg-dark-error-container text-dark-error-container-on" : "bg-error-container text-error-container-on"}>
        <p className={"text-lg sm:text-3xl py-4"}>{message}</p>
    </div>
)

export default ErrorBar