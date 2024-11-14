import { useLoaderData, Outlet, ScrollRestoration } from "react-router-dom"

import { useAuth } from "../App"
import { fetchUser } from "../utils/fetchers"

import Header from "../components/common/Header"
import Footer from "../components/common/Footer"


export async function loader() {
    return await fetchUser()
}


export default function PageLayout() {

    const { JWToken, JWTExpiresSoon, JWTRefresher } = useAuth()
    // if the token expires soon, update it before loading the user
    JWToken && JWTExpiresSoon() && JWTRefresher()
    const user = useLoaderData()?.logged_user
    return (
        <div className="page-layout">
            <Header JWToken={JWToken} user={user} />
            <main>
                <Outlet context={{ user }} />
            </main>
            <Footer />
            { 
            // ScrollRestoration will reset window view to the window's top on route changes
            // getKey with `location.pathname` will prevent creating multiple ScrollRestoration
            // points on revisiting the same url (default is `location.key`)
            }
            <ScrollRestoration getKey={ (location, matches) => { return location.key } } />
        </div>
    )
}
