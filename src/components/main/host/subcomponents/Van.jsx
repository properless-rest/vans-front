import { Link, useNavigate } from "react-router-dom"

import { serverUrl } from "../../../../utils/serverUtils";

import "../../styles/host/Van.css"

import editSVG from "/svg/edit-icon.svg"
import deleteSVG from "/svg/delete-icon.svg"


export default function Van({ uuid, name, price, imgSrc, statePage }) {

    function handleDIVClick(e) {
        e.stopPropagation(); 
        navigate(`/host/vans/${uuid}`, { state: {fromPage: statePage} } ) 
    }

    const navigate = useNavigate()
    return (
        <div className="host-van" onClick={ e => { handleDIVClick(e) } } >
            <div className="content">
                <img src={`${serverUrl}/${imgSrc}`} alt="Van image"/>
                <div className="name-price">
                    <h5 className="name">{name}</h5>
                    <span className="price">${price}/day</span>
                </div>
            </div>
            <div className="link-container">
                <Link className="van-link" to={`/host/vans/${uuid}/edit`}>
                    {/* without the onClick with stopPropagation() clicking <img /> eventually redirects back to the Van view  */}
                    <img className="link" src={editSVG} alt="icon-edit" onClick={ e => e.stopPropagation() } />
                </Link>
                <Link className="van-link" to={`/host/vans/${uuid}/delete`}>
                    {/* without the onClick with stopPropagation() clicking <img /> eventually redirects back to the Van view  */}
                    <img className="link" src={deleteSVG} alt="icon-delete" onClick={ e => e.stopPropagation() } />
                </Link>
            </div>
        </div>

    )
}
