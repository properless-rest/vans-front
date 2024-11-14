import { Link } from "react-router-dom"

import AboutPageHeroImg from "/aboutpage-hero-main.png"

import "./styles/AboutPage.css"


export default function AboutPage() {
    return (
        <section className="about-page">
            <img className="hero-image" src={AboutPageHeroImg} alt="About Page Hero Image: Contemplate the stars"/>
            <div className="div-text">
                <h2 className="title">Don’t squeeze in a&nbsp;sedan when you could relax in a&nbsp;van.</h2>
                <p>
                    Our mission is to enliven your road trip with the perfect travel van rental. 
                    Our&nbsp;vans are recertified before each trip to ensure your travel plans can go off without a hitch.
                    (Hitch costs extra&nbsp;😉)
                </p>
                <p>
                    Our team is full of vanlife enthusiasts who know firsthand the magic of touring the world on 4&nbsp;wheels.
                </p>
                <div className="vans-box">
                    <h3 className="subtitle">Your destination is&nbsp;waiting.</h3>
                    <h3 className="subtitle">Your van is ready.</h3>
                    <Link className="btn-explore-link" to="/vans">
                        <button className="btn-explore">
                            Explore our vans
                        </button>
                    </Link>
                </div>
            </div>
        </section>
    )
}
