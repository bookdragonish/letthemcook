import { Link } from "react-router-dom";
import { useState } from "react";
import style from "./Navbar.module.css";

const Navbar = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  return (
    <>
      <nav
        className={style.navbar}
        role="navigation"
        aria-label="Main navigation"
      >
        <section className={style.desktopNavContainer}>
          <Link to={"/"} className={style.logo}>
            <img
              src={"/project2/src/assets/logo.svg"}
              alt="Let Them Cook logo - go to homepage"
            />
          </Link>

          <ul className={style.linklist}>
            <li className={style.hideOnMobile}>
              <Link to={"/"} className={style.link}>
                HOME
              </Link>
            </li>
            <li className={style.hideOnMobile}>
              <Link to={"/search"} className={style.link}>
                SEARCH
              </Link>
            </li>
          </ul>

          <button
            onClick={toggleSidebar}
            aria-label={sidebarOpen ? "Close menu" : "Open menu"}
            aria-controls="mobile-menu"
            aria-expanded={sidebarOpen}
            className={style.menuButton}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="40px"
              viewBox="0 -960 960 960"
              width="40px"
              fill="#014101"
              cursor="pointer"
            >
              <path d="M120-240v-80h720v80H120Zm0-200v-80h720v80H120Zm0-200v-80h720v80H120Z" />
            </svg>
          </button>
        </section>
        <ul
          id="mobile-menu"
          className={`${style.sidebar} ${
            sidebarOpen ? style.sidebarOpen : style.sidebarClosed
          } ${style.hideOnDesktop}`}
          role="list"
          aria-label="Mobile navigation"
        >
          <li>
            <Link
              to={"/"}
              className={style.link}
              tabIndex={sidebarOpen ? 0 : -1}
            >
              HOME
            </Link>
          </li>
          <li>
            <Link
              to={"/search"}
              className={style.link}
              tabIndex={sidebarOpen ? 0 : -1}
            >
              SEARCH
            </Link>
          </li>
        </ul>
      </nav>
    </>
  );
};

export default Navbar;
