import { 
    useLocation, useOutletContext,
    Link
} from "react-router-dom"

import { serverUrl } from "../../../utils/serverUtils"


export default function VanPageView() {
    const { van } = useOutletContext()
    const location = useLocation()
    const search = location.state?.search || ""
    const vanFilter = location.state?.type || "all"
    console.log(van.image)
    return (
        <section className="van-view">
            <Link to={`..${search}`} relative="path" className="vans-link">&larr; Back to {vanFilter} Vans</Link>
            <img src={`${serverUrl}/${van.image}`} alt="Van profile image" />
            <span className={`van-type van-${van.type}`}>{van.type}</span>
            <h3 className="name">{van.name}</h3>
            <span className="price"><b>${van.pricePerDay}</b>/day</span>
            <p className="description">{van.description}</p>
            <div className="btn-box">
                <Link className="van-link" to="rent">
                    <button>
                            Rent this van
                    </button>
                </Link>
                <Link className="van-link" to="review">
                    <button >
                            Leave a Review
                    </button>
                </Link>
            </div>
        </section>
    )
}
