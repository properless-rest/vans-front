import { useOutletContext, Outlet, Navigate, NavLink } from "react-router-dom";

import { useAuth } from "../../../App";

import "../styles/host/HostLayout.css"


function LoadingAnimation() {
    return (
        <div className="loader"></div>
    )
}


export default function HostLayoutProtected() {
    const { JWToken, JWTRefresher, JWTExpiresSoon } = useAuth()
    // don't check the user to navigate to login; it takes more time to load the user.
    if (!JWToken) return <Navigate to="/login?message=Please, LOG IN first" />
    const { user } = useOutletContext()  // comes from PageLayout.jsx
    if (!user) return <LoadingAnimation/>
    // refresh the JWT every time this page is visited if JWTExpiresSoon
    JWTExpiresSoon() && JWTRefresher()
    return (
        <div className="host-layout">
            <nav className="host-navbar">
                {/* NavLinks' style switching on re-routing is implemented entirely with css (with the '.active' class) */}
                {/* param 'end' makes index NavLinks non-active on re-routing to the children links */}
                <NavLink to="." end >Dashboard</NavLink>
                <NavLink to="income">Income</NavLink>
                <NavLink to="vans">My Vans</NavLink>
                <NavLink to="reviews">Reviews</NavLink>
            </nav>
            <Outlet context={{ user }} />
        </div>
    )
}
