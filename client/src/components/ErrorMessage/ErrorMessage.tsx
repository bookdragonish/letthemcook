import style from './ErrorMessage.module.css';

function ErrorMessage() {

    const refreshPage = () => {
        window.location.reload();
    }

    return (
        <div className={style.message_box}>
            <p className={style.error_text}>An error has occured.
                Please try again.
            </p>
            <button className={style.refresh_button} onClick={refreshPage}>Refresh</button>
        </div>
    );
}

export default ErrorMessage;