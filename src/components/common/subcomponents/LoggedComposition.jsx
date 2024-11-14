import { NavLink } from "react-router-dom"

import { serverUrl } from "../../../utils/serverUtils"

import userDefaultPic from "/users/default.png"


export default function LoggedComposition({ user, authLinksVisible, setAuthLinksVisible, closePopUpNavOnReroute }) {

    function handlePicClick() {
        setAuthLinksVisible( currentState => !currentState )
    }

    function handleProfileClick() {
        // the idea is that when you click on the profile NavLink
        // the AuthPopUp closes; all the other NavLinks don't close
        // the AuthPopUp

        // note: the order of the state setters is relevant
        setAuthLinksVisible( currentState => !currentState )
        closePopUpNavOnReroute()
    }
    // user gets loaded for a brief period of time
    const profileImg = user?.avatar ? `${serverUrl}/${user.avatar}` : userDefaultPic
    return (
        <>
            <img className="logged-pic" src={profileImg} alt="profile avatar" onClick={handlePicClick} />
            <div className="div-logged-links" style={{ display: authLinksVisible ? "flex" : "none" }}>
                <NavLink className="logged-link" to="/user" onClick={handleProfileClick}>Profile</NavLink>
                {/* when logging out, always hide the LoggedComposition by changing state to false */}
                <NavLink className="logged-link" to="/logout" onClick={ () => closePopUpNavOnReroute() }>Logout</NavLink>
            </div>
        </>
    )
}
