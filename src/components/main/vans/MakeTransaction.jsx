import { useState, useEffect, useRef } from "react"

import { 
    useActionData, useOutletContext, useNavigation,
    Form,
    redirect
} from "react-router-dom"

import { 
    format, 
    addDays, 
    differenceInDays,
    isBefore
} from 'date-fns';

import { makeTransaction } from "../../../utils/fetchers"

import "../styles/vans/MakeTransaction.css"

import hostIcon from "/svg/host-icon.svg"
import vanIcon from "/svg/van-icon.svg"


export async function action({ request, params }) {
    const formData = Object.fromEntries(await request.formData())
    const vanUUID = formData.vanUUID
    const lesseeName = formData["lessee-name"]
    const lesseeSurname = formData["lessee-surname"]
    const lesseeEmail = formData["lessee-email"]
    const rentCommencement = formData["rent-commencement"]
    const rentExpiration = formData["rent-expiration"]
    const price = formData["price"]
    if (! (vanUUID 
        && lesseeName && lesseeSurname && lesseeEmail
        && rentCommencement && rentExpiration
        && price
        ) 
    ) return { message: "Fill in every input", status: 400 }
    if (!lesseeEmail.includes('@')) {
        return { message:"Wrong email format", status: 400 }
    }
    // for non-digit strings `Number(string)` returns a NaN
    if (!Number(price) || Number(price) < 1) return { message:"Invalid price", status: 400 }
    const tomorrowFormated = format(addDays(new Date(), 1), 'yyyy-MM-dd');

    if (
        // input expiration equals or preceeds input commencement
        differenceInDays(rentExpiration, rentCommencement) <= 0
        // input commencement is earlier than tomorrow's date
        || isBefore(rentCommencement, tomorrowFormated)
    ) return { message: "Invalid data input", status: 400 }
    try {
        const data = await makeTransaction(
            { 
                vanUUID, 
                lesseeName, lesseeSurname, lesseeEmail, 
                rentCommencement, rentExpiration, 
                price 
            }
        )
        // a field which comes from the the server on resp.:200
        if (data.success) return redirect("/vans")
        return data // return error message if the responce is not a success
    } catch(err) {
        return err
    }
}


export default function MakeTransaction() {

    function handleCommencementChange(e) {
        setCommencement(format(e.target.value, 'yyyy-MM-dd'))
        const newMinExpirationDate = format(addDays(e.target.value, 1), 'yyyy-MM-dd');
        setMinExpiration(newMinExpirationDate)
        const dayDiff = differenceInDays(e.target.value, expiration)  // don't use `commencement` const instead of e.(...);
        if (dayDiff >= 0) {
            const newExpirationDate = format(addDays(e.target.value, 1), 'yyyy-MM-dd');
            setExpiration(newExpirationDate)
        }
    }

    function handleExpirationChange(e) {
        const dayDiff = differenceInDays(expiration, commencement)
        if (dayDiff < 1) {
            const newCommencementDate = format(addDays(e.target.value, dayDiff), 'yyyy-MM-dd');
            setCommencement(newCommencementDate)
        }
        setExpiration(format(e.target.value, 'yyyy-MM-dd'))
    }

    function handleHintRefs(hintRef) {
        if (hintRef.current) {
            hintRef.current.scrollIntoView()
        }
    }

    const { van } = useOutletContext()
    const { full_name: hostFullname, email: hostEmail } = van?.host
    
    // used as the earliest possible rent commencement date (tomorrow)
    const tomorrowFormated = format(addDays(new Date(), 1), 'yyyy-MM-dd');
    const [commencement, setCommencement] = useState(tomorrowFormated);
    const [expiration, setExpiration] = useState(format(addDays(new Date(), 2), 'yyyy-MM-dd'));
    // dynamically adjusted date no sooner than 1 day after the commencement date
    const [minExpiration, setMinExpiration] = useState(expiration);

    const [price, setPrice] = useState(van.pricePerDay)
    const [vanDataVisible, setVanDataVisible] = useState(true)
    const [confirmationBoxIsVisible, setConfirmationBoxIsVisible] = useState()
    const navigation = useNavigation()
    const actionData = useActionData()
    const hintRef = useRef(null)
    const confirmRef = useRef(null)
    
    useEffect(
        () => {
            const dayDiff = differenceInDays(expiration, commencement)
            setPrice(van.pricePerDay * dayDiff)
        },
        [commencement, expiration]
    )
    const hiddenLine = <span style={{ visibility: "hidden" }}>HIDDEN ADDITIONAL LINE</span>
    const msgPlaceholder = <h5 className="message-placeholder" style={{ visibility: "hidden" }}>{"x"}</h5>
    return (
        <section className="make-transaction">
            <h2 className="title">Rent the Van</h2>

            <div 
                className="description"
                style={{ display: vanDataVisible? "flex" : "none" }}
            >
                <span><b>Van Name:</b> {van.name}</span>
                <span><b>Price:</b> {van.pricePerDay}$ / day</span>
                {hiddenLine}
                <img 
                    className="icon-switch" 
                    draggable="false"
                    src={hostIcon} 
                    alt="host-icon"
                    onClick={ () => setVanDataVisible(false) } 
                />
            </div>
            <div 
                className="description"
                style={{ display: vanDataVisible? "none" : "flex" }}
            >
                <span><b>Van Owner:</b> {hostFullname}</span>
                <span><b>Host Email:</b> {hostEmail}</span>
                {hiddenLine}                
                <img 
                    className="icon-switch" 
                    draggable="false"
                    src={vanIcon} 
                    alt="host-icon"
                    onClick={ () => setVanDataVisible(true) }
                />
            </div>
            <div 
                ref={hintRef} 
                tabIndex="-1" /* tabindex is needed for focusing with handleHintRefs() */ 
            ></div>
            {
                navigation.state === "idle" && actionData ?
                <h5 className="form-message">{actionData.message || "Error. Try again later"}</h5>
                :
                msgPlaceholder
            }
            <Form 
                className="trx-form" 
                method="POST">
                <input className="trx-input" hidden readOnly required type="text" name="vanUUID" defaultValue={van.uuid} />
                <div className="trx-input-group">
                    <label className="rent-label" htmlFor="trx-lessee-name">Your Name:</label>
                    <input id="trx-lessee-name" className="trx-input" type="text" name="lessee-name" required />
                </div>
                <div className="trx-input-group">
                    <label className="rent-label" htmlFor="trx-lessee-surname">Your Surname:</label>
                    <input id="trx-lessee-surname" className="trx-input" type="text" name="lessee-surname" required />
                </div>
                <div className="trx-input-group">
                    <label className="rent-label" htmlFor="trx-lessee-email">Your Email:</label>
                    <input id="trx-lessee-email" className="trx-input" type="email" name="lessee-email" required />
                </div>
                <div className="trx-input-group">
                    <label className="rent-label" htmlFor="trx-commencement">Rent starts:</label>
                    <input 
                        id="trx-commencement" 
                        className="trx-input" 
                        type="date"
                        name="rent-commencement" 
                        value={commencement}
                        min={tomorrowFormated}
                        required
                        onChange={ e => handleCommencementChange(e) }
                    />
                </div>
                <div className="trx-input-group">
                    <label className="rent-label" htmlFor="trx-expiration">Rent ends:</label>
                    <input 
                        id="trx-expiration" 
                        className="trx-input" 
                        type="date" 
                        name="rent-expiration" 
                        value={expiration}
                        min={minExpiration}
                        required
                        onChange={ e => handleExpirationChange(e) }
                    />
                </div>

                <input 
                    className="trx-input" 
                    placeholder="AUTOMATIC PRICE FIELD"
                    type="number" 
                    name="price" 
                    hidden
                    value={price}
                    onChange={ () => { return null } } // hopefully, prevents from malicious HTML alterations
                    required 
                    min={1} 
                />
                <span className="trx-price">
                    <span>Transaction price: </span>
                    <span>{price} $</span>
                </span>
                <div 
                    className="confirmation-focus"
                    ref={confirmRef} tabIndex="-1" /* tabindex is needed for focusing with handleHintRefs() */ 
                />
                <div 
                    className="confirmation-box" 
                    style={{ display: confirmationBoxIsVisible ? "flex" : "none"}}
                >
                    <h4 className="confirmation">Do you confirm the&nbsp;transaction?</h4>
                    <div className="button-box">
                        <button 
                            className="btn-transact"
                            type="submit"
                            onClick={ () => { setConfirmationBoxIsVisible(false); handleHintRefs(hintRef) } } 
                            disabled={ navigation.state === "submitting" }
                        >
                            Confirm
                        </button>
                        <button 
                            className="btn-undo"
                            onClick={ () => setConfirmationBoxIsVisible(false) }
                            type="button"
                        >
                            Return
                        </button>
                    </div>
                </div>

            </Form>
            <button 
                onClick={ () => { setConfirmationBoxIsVisible(true); handleHintRefs(confirmRef) } }
                style={{ visibility: confirmationBoxIsVisible ? "hidden" : "initial" }}
                className="btn-rent" 
                type="submit" 
                disabled={ navigation.state === "submitting" }
            >
                Rent this Van
            </button>
        </section>
    )
}
