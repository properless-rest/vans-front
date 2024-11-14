import { useOutletContext, Link } from "react-router-dom"

import Van from "./subcomponents/Van"
import AddVan from "./subcomponents/AddVan"

import "../styles/host/HostVans.css"


export default function HostVansPage() {
    const { user } = useOutletContext()  // comes from HostLayoutProtcted.jsx
    const userVans = user.vans
    const userVansElems = userVans.sort(
        // sorting by name, alphabetically desc.
        (van1, van2) => {
            if (van1.name < van2.name) return -1; // a comes before b
            if (van1.name > van2.name) return 1;  // a comes after b
            return 0; // a and b are equal
        }
    )
    
    .map(
        userVan => 
        {   
            const { uuid, name, pricePerDay, image } = userVan
            return <Van key={uuid} uuid={uuid} name={name} price={pricePerDay} imgSrc={image} statePage="myVans" /> 
        }
    )
    userVansElems.push(<AddVan key={"27df32bf671041b894da7776e4372e04"} />)
    return (
        <section className="host-vans">
            <h3 className="title">Your hosted vans:</h3>
            <div className="myvans-grid">
                {userVansElems}
            </div>
        </section>
    )
}

const noVansStyle = {  padding: "0.25rem", fontSize: "1.25rem", fontWeight: "500", textAlign: "center" }
