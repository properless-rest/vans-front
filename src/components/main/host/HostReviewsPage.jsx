import { useOutletContext } from "react-router-dom"

import Metric from "./subcomponents/Metric"
import Review, { Star } from "./subcomponents/Review"

import { roundNumber } from "../../../utils/operations"

import "../styles/host/HostReviews.css"


export default function HostReviewsPage() {
    const { user } = useOutletContext()
    const { reviews } = user
    const rates = reviews.map( review => review.rate )
    const totalRates = rates.reduce( (reducer, rate) => reducer + rate, 0 )
    const overallRate = roundNumber(totalRates / (rates.length ? rates.length : 1), 1)  // `n` divided by 1 is `n`
    const ratesDistribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
    reviews.forEach( review => { ratesDistribution[review.rate] += 1} )
    const ratesRelativeDistribution = {}
    for (const rate in ratesDistribution) {
        ratesRelativeDistribution[rate] = ratesDistribution[rate] / (rates.length ? rates.length : 1)
    }
    const metricElems = [5, 4, 3, 2, 1].map(
        rate => <Metric key={rate} metric={{ rate: rate, distribution: ratesRelativeDistribution[rate] }} />
    )
    const reviewElems = reviews.map(
        review => <Review key={review.uuid} review={review} />
    )
    return (
        <section className="host-reviews">
            <h2 className="title">Your Reviews</h2>
            <div className="overall-box">
                <span className="overall">{overallRate}</span>
                <Star />
                <span className="pseudohint">Overall Rating</span>
            </div>
            <div className="metric-box">
                {metricElems}
            </div>
            <h3 className="total-reviews">Reviews: [{reviews.length}]</h3>
            <div className="reviews-grid">
                {
                reviews.length ? 
                reviewElems 
                :
                <span style={{
                     fontSize: "20px",
                     fontWeight: "500"
                    }}>No reviews yet</span>
                }
            </div>
        </section>
    )
}
