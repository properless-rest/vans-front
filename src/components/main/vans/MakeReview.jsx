import { useState, useRef } from "react"

import { 
    useOutletContext, useNavigate,
    Form,
} from "react-router-dom"


import { makeReview } from "../../../utils/fetchers"

import { serverUrl } from "../../../utils/serverUtils"

import "../styles/vans/MakeReview.css"


export default function MakeReview() {

    async function handleFormSubmit(e) {
        e.preventDefault()
        setError(null)
        setNavState("submitting")
        if (!rating) {
            setError({ message: "Inadmissible rating" })
            setNavState("idle")
            return null
        }
        try {
            const data = await makeReview(
                {
                    vanUUID: van.uuid,
                    author,
                    review,
                    rating
                }
            )
            if (data.success) return navigate("/vans")
            else (setError(data))
        } catch(err) {
            setError(err)
            return err
        } finally {
            setNavState("idle")
        }
    }


    function handleStarClick(star) {
        setRating(star)
    }

    function handleHintRef() {
        if (hintRef.current) {
            hintRef.current.scrollIntoView()
          }
    }

    const { van } = useOutletContext()
    const [author, setAuthor] = useState("")
    const [review, setReview] = useState("")
    const [rating, setRating] = useState(null)
    const rateStars = [1, 2, 3, 4, 5].map(
        (star, index) => <Star 
                            key={index}
                            star={star}
                            rating={rating}
                            handleStarClick={handleStarClick}
                        />
    )
    const [error, setError] = useState(null)
    const [navState, setNavState] = useState("idle")
    const navigate = useNavigate()
    const hintRef = useRef(null)
    return (
        <section className="make-review">
            <h2 className="title">Leave your Review</h2>
            <Form method="post" onSubmit={handleFormSubmit}>
                <div className="preset-info">
                    <img src={`${serverUrl}/${van.image}`} alt="Van image" />
                    <div className="text-data">
                        <span><b>Name:</b> {van.name}</span>
                        <span><b>Host:</b> {van.host.full_name}</span>
                    </div>
                </div>
                <div ref={hintRef} className="focus-div" />
                {   
                    error && navState === "idle"
                    ?
                    <h4 className="error">{error.message ? error.message : "Server Error"}</h4>
                    :
                    <h4 className="err-placeholder" style={{ visibility: "hidden" }}>X</h4> 
                }
                <div className="input-fields">
                    <input 
                        id="review-author" 
                        className="review-input" 
                        value={author}
                        onChange={ (e) => setAuthor(e.target.value) }
                        type="text" 
                        placeholder="Reviewer"
                        required 
                    />
                    <textarea 
                        id="review-text"
                        className="review-textarea"
                        value={review}
                        onChange={ (e) => setReview(e.target.value) } 
                        draggable={false} 
                        placeholder="Your review"
                        rows={5}
                        required 
                    />
                    <div className="star-ratings-group">
                        <b className="rating">Rating: </b>
                        <div className="stars-box">
                            {rateStars}
                        </div>
                    </div>
                </div>
                <button 
                    className="btn-submit"
                    disabled={navState === "submitting"}
                    onClick={handleHintRef}
                >
                    Submit
                </button>
            </Form>
        </section>
    )
}


function Star({ star, rating, handleStarClick }) {
    return(
        <span
            className="star"
            onClick={ () => handleStarClick(star) } 
            style={{ 
                cursor: 'pointer',
                color: star <= rating ? '#FFD700' : '#CCC' // Enabled/Disabled
            }}
        >
            ★
        </span>
    )
}
