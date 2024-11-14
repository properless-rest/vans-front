import { Link } from "react-router-dom"

import { getDate, getMonth, getYear } from "date-fns"


import starSVG from "/svg/review-star.svg"


export function Star() {
    return(
        <img className="review-star" src={starSVG} />
    )
}


function formatDate(date) {
    const day = getDate(date)
    const month = numToMonthFns[getMonth(date)]
    const year = getYear(date)
    return `${month} ${day}${ordinalEndings[day]}, ${year}`
}


export default function Review({ review }) {
    const { author, publication_date: date, rate, text, van_name: van, van_uuid: vanUUID } = review
    const formattedDate = formatDate(date)
    const starsArr = Array(rate).fill(0)
    const starsElems = starsArr.map( (starNum, index) => <Star key={index} />)
    return (
        <div className="review">
            <span className="stars">{starsElems}</span>
            <div className="author-date-box">
                <span className="author">{author}</span>
                <span className="date">{formattedDate}</span>
            </div>
            <Link to={`/host/vans/${vanUUID}`}>
                <span className="van-name">{van}</span>
            </Link>
            <p className="text">{text}</p>
            <div className="separator"></div>
        </div>
    )
}

const numToMonthFns = {
    1: "January",
    2: "February",
    3: "March",
    4: "April",
    5: "May",
    6: "June",
    7: "July",
    8: "August",
    9: "September",
    10: "October",
    11: "November",
    12: "December",
}

const ordinalEndings = {
    1: "st",
    2: "nd",
    3: "rd",
    4: "th",
    5: "th",
    6: "th",
    7: "th",
    8: "th",
    9: "th",
    10: "th",
    11: "th",
    12: "th",
    13: "th",
    14: "th",
    15: "th",
    16: "th",
    17: "th",
    18: "th",
    19: "th",
    20: "th",
    21: "st",
    22: "nd",
    23: "rd",
    24: "th",
    25: "th",
    26: "th",
    27: "th",
    28: "th",
    29: "th",
    30: "th",
    31: "st"
}
