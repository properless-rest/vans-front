import { useOutletContext, NavLink } from "react-router-dom"

import Van from "./subcomponents/Van"

import { roundNumber } from "../../../utils/operations"

import "../styles/host/HostDashboard.css"
import "../styles/host/loader.css"

import starSVG from "/svg/review-star.svg" 


export default function HostDashboardPage() {
    const { user } = useOutletContext()  // comes from HostLayoutProtcted.jsx
    const transactions = user.transactions
    const reviews = user.reviews
    // if a user has no income yet, the code below does not break anything
    const totalIncome = transactions.reduce( (total, transaction) => total + transaction.price, 0 )
        .toString()
        .replace(/\B(?=(\d{3})+(?!\d))/g, "'") // adds an ' for each radix (3 digits)
    //
    const rates = reviews.map( review => review.rate )
    const totalRates = rates.reduce( (reducer, rate) => reducer + rate, 0 )
    const overallRate = roundNumber(totalRates / (rates.length ? rates.length : 1), 1)  // `n` divided by 1 is `n`
    const userVans = user.vans
    const userVansElems = userVans
    .sort(
        (van1, van2) => (van2.pricePerDay - van1.pricePerDay) 
    )
    .slice(0, 4)
    .map(
        userVan => 
        {   
            const { uuid, name, pricePerDay, image } = userVan
            {/* statePage is used in HostVansPageLayout to redirect back from the page either to dashboard or to myVans */}
            return <Van key={uuid} uuid={uuid} name={name} price={pricePerDay} imgSrc={image} statePage="dashboard" /> 
        }
    )
    return (
        <section className="host-dashboard">
            <div className="div-greet-income">
                <h2 className="greet">{user.name} {user.surname}</h2>
                <span className="total">Total Income:</span>
                <div className="div-income">
                    <span className="income">${totalIncome}</span>
                    <NavLink to="income">Details</NavLink>
                </div>
            </div>
            <div className="div-reviews">
                <span className="box-rating">
                    <span className="avg">Average score:</span>
                    <img 
                        className="review-star" 
                        src={starSVG}
                        alt="star" 
                    />
                    <span className="rating">{overallRate}/ 5.0</span>
                </span>
                <NavLink to="reviews">Details</NavLink>
            </div>
            <div className="div-myvans">
                <div className="box-title">
                    <span className="mpv">Top pricey Vans:</span>
                    <NavLink to="vans">View all</NavLink>
                </div>
                <div className="myvans-grid">
                    {
                        userVansElems.length ?
                        userVansElems
                        :
                        <span style={noVansStyle}>You don't have no hosted vans yet</span>
                    }
                </div>
            </div>
        </section>
    )
}

const noVansStyle = {  
    padding: "0.25rem", 
    fontSize: "1.25rem", fontWeight: "500", 
    gridColumn: "1 / span 2"  // Note: wide screens have 2 grid columns
}
