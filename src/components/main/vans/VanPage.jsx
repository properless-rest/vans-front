import { 
    useLoaderData, useLocation,
    Link, Outlet
} from "react-router-dom"

import { fetchVans } from "../../../utils/fetchers"

import "../styles/vans/VanPage.css"


export async function loader({ params }) {
    return await fetchVans(params.vanUUID)
}

export default function VanPage() {
    // this component simply passes the van data for view or for transaction creation form
    const van = useLoaderData().van
    if (!van) return <h2 style={{ alignSelf: "center" }}>This van does not exist</h2>
    return <Outlet context={{ van }} />
}
