import { Link, useNavigate } from "react-router-dom"; 
import style from "./CrossButton.module.css"; 

function CrossButton() {
    const navigate = useNavigate();

    const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault(); // Prevent Link standard navigation
        navigate(-1);       // Go back in history to last page you visited
    };

    return (
        <>
            <Link
                to="/"
                onClick={handleClick}
                className={style.cross_button}
                title="Close and go back"
                aria-label="Go back to previous page"
                role="button"
            >
                <img
                    id={style.cross}
                    src="/project2/src/assets/entypo_cross.svg"
                    alt="cross"
                    aria-hidden="true"
                />
            </Link>
        </>);
}

export default CrossButton;