

import { useNavigate } from "react-router-dom"

import "../../styles/host/AddVan.css"

import addVanSVG from "/svg/addVan.svg"


export default function AddVan() {

    function handleDIVClick(e) {
        e.stopPropagation(); 
        navigate("/host/vans/add") 
    }

    const navigate = useNavigate()
    return (
        <div className="host-van add-van" onClick={ e => { handleDIVClick(e) } } >
            <h5 className="text">Add a new Van</h5>
            <img className="add" src={addVanSVG} alt="icon-add" />
        </div>

    )
}
