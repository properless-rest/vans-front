import { useLoaderData, useSearchParams } from "react-router-dom"

import { fetchVans } from "../../../utils/fetchers.js"

import Van from "./subcomponents/Van"

import "../styles/vans/VansPage.css"


export async function loader() {
    return await fetchVans()
}

// type, pricePerDay: price, image
export default function Vans() {

    function handleFilterChange(key, value) {
        setSearchParams(
            params => 
            {
                if (value === null) {
                    params.delete(key)
                } else {
                    params.set(key, value)
                }
                return params
            }
        )
    }

    const vans = useLoaderData().vans
    const [searchParams, setSearchParams] = useSearchParams()
    const typeFilter = searchParams.get("type")
    const displayedVans = typeFilter ? vans.filter( van => van.type === typeFilter ) : vans
    const vanElems = displayedVans.map(
        van => 
        <Van 
            key={van.id} 
            uuid={van.uuid} 
            name={van.name} 
            type={van.type} 
            dailyPrice={van.pricePerDay} 
            imageURL={van.image}

            searchParams={searchParams}
            typeFilter={typeFilter}
        />
    )
    return (
        vanElems.length ?
        <section className="vans-page">
            <h2 className="title">Explore our van&nbsp;options</h2>
            <div className="filter-box">
                <button className="btn-filter"
                        style={{ 
                            color: typeFilter === "Simple" ? filterStyle.color : "",
                            backgroundColor: typeFilter === "Simple" ? filterStyle.Simple : ""
                        }}
                        onClick={ () => {handleFilterChange("type", "Simple")} }
                >
                    Simple
                </button>
                <button className="btn-filter"
                        style={{ 
                            color: typeFilter === "Rugged" ? filterStyle.color : "",
                            backgroundColor: typeFilter === "Rugged" ? filterStyle.Rugged : ""
                        }}
                        onClick={ () => {handleFilterChange("type", "Rugged")} }
                >
                    Rugged
                </button>
                <button className="btn-filter"
                        style={{ 
                            color: typeFilter === "Luxury" ? filterStyle.color : "",
                            backgroundColor: typeFilter === "Luxury" ? filterStyle.Luxury : ""
                        }}
                        onClick={ () => {handleFilterChange("type", "Luxury")} }
                >
                    Luxury
                </button>
                {
                typeFilter &&
                <span className="filter-reset"
                      onClick={ () => {handleFilterChange("type", null)} }
                >
                    Reset filters
                </span>
                }
            </div>

            <div className="van-grid">
                {vanElems}
            </div>
        </section>
        :
        <h2 style={{ textAlign: "center", margin: "auto", padding: "1rem", fontSize: "28px" }}>
            Currently there are no vans available.
        </h2>
    )
}


const filterStyle = { 
    color: "#FFEAD0",
    Simple: "#E17654",
    Rugged: "#115E59",
    Luxury: "#161616",
}
