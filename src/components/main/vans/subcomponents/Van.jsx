import { Link } from "react-router-dom"

import { serverUrl } from "../../../../utils/serverUtils"

export default function Van({ uuid, name, type, dailyPrice, imageURL, searchParams, typeFilter }) {
    return (
        <Link className="van-link" to={`${uuid}`} state={{ search: `?${searchParams.toString()}`, type: typeFilter }}>
        <div className="van"> 
            <img src={`${serverUrl}/${imageURL}`} alt="Van image" />
            <div className="text-grid">
                <span className={`van-name van-${type}`}>{name}</span>
                <span className={`van-type van-${type}`}>{type}</span>
                <span className="van-price">${dailyPrice}/d.</span>
            </div>
        </div>
        </Link>
    )
}
