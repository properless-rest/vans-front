import { useEffect, useState } from "react"
import { Link, NavLink } from "react-router-dom"

import LoggedComposition from "./subcomponents/LoggedComposition"

import hamburgerSVG from "/svg/hamburger-menu.svg" 


export default function Header({ JWToken, user }) {

    function switchMenuState() {
        setMenuIsOpen( currentState => !currentState )
    }

    function handleScreenResize() {
        const currentWidth = window.innerWidth
        if (currentWidth >= 600 && !menuIsOpen) {
            // note: order of the state setters is important
            setAuthLinksVisible(false)
            setMenuIsOpen(true)
        }
        else if (currentWidth < 600 && menuIsOpen) {
            // note: order of the state setters is important
            setAuthLinksVisible(true)
            setMenuIsOpen(false)
        }
    }

    function closePopUpNavOnReroute() {
        // closes pop-up with NavLinks for displays with screenidth < 600
        const currentWidth = window.innerWidth
        if (currentWidth < 600) {
            // note: order of the state setters is important
            setAuthLinksVisible(true)
            setMenuIsOpen(false)
        } else if (currentWidth >=600) {
            setAuthLinksVisible(false)
            setMenuIsOpen(true)
        }
    }

    const currentWidth = window.innerWidth
    const [menuIsOpen, setMenuIsOpen] = useState(currentWidth < 600 ? false : true)
    const [authLinksVisible, setAuthLinksVisible] = useState(currentWidth < 600 ? true : false)

    // below is the only implementation of useEffect that works:
    // add menuIsOpen to dependency list and recreate a new EL
    // every time it changes state, remove the previous EL
    useEffect(
        () => { 
            window.addEventListener("resize", handleScreenResize) 
            return () => { window.removeEventListener("resize", handleScreenResize) }
        } , 
        [menuIsOpen]
    )
    return (
        <header>
            <Link to="/">
                <h1 className="header-logo">#VANLIFE</h1>
            </Link>
            <nav>
                <div className="navlink-div" style={menuIsOpen ? openedMenu : closedMenu}>
                    <span className="close-menu" onClick={switchMenuState}>&times;</span>
                    {
                    // dynamic styling for NavLinks is implemented in the App.css file
                    }
                    <NavLink to="host" onClick={closePopUpNavOnReroute}>Host</NavLink>
                    <NavLink to="about" onClick={closePopUpNavOnReroute}>About</NavLink>
                    <NavLink to="vans" onClick={closePopUpNavOnReroute}>Vans</NavLink>
                    {
                    JWToken ?
                    <LoggedComposition
                        user={user}
                        authLinksVisible={authLinksVisible}
                        setAuthLinksVisible={setAuthLinksVisible}
                        closePopUpNavOnReroute={closePopUpNavOnReroute} 
                    />
                    :
                    <NavLink to="/login" onClick={closePopUpNavOnReroute}>Login</NavLink>
                    }
                </div>
                <img 
                    className="hamburger-menu" 
                    src={hamburgerSVG}
                    alt="Hamburger" 
                    onClick={switchMenuState}
                />
            </nav>
        </header>
    )
}

const openedMenu = { display: "flex", overflow: "hidden" }
const closedMenu = { display: "none", overflow: "initial" }
