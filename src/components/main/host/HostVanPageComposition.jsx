import { 
    useLocation, useOutletContext, useParams,
    Link, NavLink, Outlet 
} from "react-router-dom"

import { fetchVans } from "../../../utils/fetchers"

import { serverUrl } from "../../../utils/serverUtils"

import "../styles/host/HostVanComposition.css"


export default function HostVanPageLayout() {
    const { user } = useOutletContext()
    const { vanUUID } = useParams()
    const van = user.vans.find( van => van.uuid === vanUUID )
    if (!van) return (
        <div style={{ height: "100%", display: "flex", alignItems:"center", justifyContent:"center" }}>
            <h2>The Van does not exist</h2>
        </div>
    )
    const { state } = useLocation() // state is set inside the Van.jsx subcomponent from the !HOST! folder
    const relative = state?.fromPage === "dashboard" ? "route" : "path"
    const previousPage = state?.fromPage === "dashboard" ? "Dashboard" : "My Vans"
    return (
            <section className="host-van-layout">
                <Link to=".." relative={relative} className="host-vans-return">&larr; Back to {previousPage}</Link>
                <div className="host-van-card">
                    <div className="van-content">
                        <img src={`${serverUrl}/${van.image}`} alt="van image" />
                        <div className="div-van-info">
                            <span className={`van-type van-${van.type}`}>{van.type}</span>
                            <h3 className="van-name">{van.name}</h3>
                            <span className="van-price">${van.pricePerDay}/day</span>
                        </div>
                    </div>
                    <nav className="host-van-nav">
                        {/* preventScrollReset deactivates leaping to the top of the page on traversing these links */}
                        <NavLink to="." end preventScrollReset>Details</NavLink>
                        <NavLink to="pricing" preventScrollReset>Pricing</NavLink>
                        <NavLink to="photos" preventScrollReset>Photos</NavLink>
                    </nav>
                    <Outlet context={{ van: van }}/>
                </div>
            </section>
    )
}


export function HostVanDetails() {
    const { van } = useOutletContext()
    return (
        <div className="host-van-details">
            <p><b>Name:</b> {van.name}</p>
            <p><b>Type:</b> {van.type}</p>
            <p><b>Description:</b> {van.description}</p>
        </div>
    )
}


export function HostVanPricing() {
    const { van } = useOutletContext()
    return (
        <p className="host-van-pricing"><b>${van.pricePerDay}</b>/day</p>  // format this
    )
}


export function HostVanPhotos() {
    const { van } = useOutletContext()
    return (
        <div className="host-van-images-grid">
            <img src={`${serverUrl}/${van.image}`} alt="host van image" />
        </div>
    )
}
