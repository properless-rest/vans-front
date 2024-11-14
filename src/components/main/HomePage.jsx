import { Link } from "react-router-dom"

import "./styles/HomePage.css"

export default function HomePage() {
    return (
        <section className="home-page">
            <h1 className="title">You got the travel plans, we&nbsp;got the travel vans.</h1>
            <p>
                Add adventure to your life by joining the&nbsp;#vanlife movement. Rent the perfect van to&nbsp;make your perfect road&nbsp;trip.
            </p>
            <Link className="btn-find-van-link" to="/vans">
                <button className="btn-find-van">
                    Find your Van
                </button>
            </Link>
        </section>
    )
}

