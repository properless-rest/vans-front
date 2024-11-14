import { useRef } from "react";

import { 
    useNavigation, useActionData,
    Form,
    redirect 
} from "react-router-dom"

import { addVan } from "../../../utils/fetchers";

import "../styles/host/HostAddVan.css"


export async function action({ request, params }) {
    const formData = Object.fromEntries(await request.formData());
    const description = formData.description
    const name = formData.name
    const pricePerDay = formData.pricePerDay
    const type = formData.type
    if (!(name && description && pricePerDay && type)) return { message: "Fill in every field", status: 400 }
    if (type !== "Simple" && type !== "Rugged" && type !== "Luxury" ) {
        return { message: "Invalid Van type", status:400 }
    }
    try {
        const data = await addVan({ description, name, pricePerDay, type })
        // a field jsonified on the server
        if (data.success) return redirect("/host/vans")
        return data // return error message if the responce is not a success
    } catch(err) {
        return err
    }
}


export default function HostAddVanPage() {

    function handleHintRef() {
        if (hintRef.current) {
            hintRef.current.scrollIntoView()
          }
    }

    const actionData = useActionData()
    const navigation = useNavigation()
    const msgPlaceholder = <h5 className="message-placeholder" style={{ visibility: "hidden" }}>{"x"}</h5>
    const hintRef = useRef(null)
    return (
        <section className="van-create">
            <h2 className="title">Add a new Van</h2>
            <Form className="add-form" method="POST">
                <div ref={hintRef} className="focus-div" />
                {
                navigation.state === "idle" && actionData ?
                <FormMessage message={actionData.message}/>
                :
                msgPlaceholder
                }
                <input 
                    className="van-input" 
                    placeholder="Van Name" 
                    type="text" 
                    name="name"
                    required 
                />
                <textarea 
                    className="van-textarea" 
                    draggable={false} 
                    placeholder="Van Description"
                    rows={5}
                    name="description" 
                    required 
                />
                <input 
                    className="van-input"
                    placeholder="Price per Day" 
                    type="number" 
                    name="pricePerDay" 
                    required 
                    min={1}
                    step="1"
                />
                <select className="van-select" name="type" required>
                    <option value="Simple">Simple</option>
                    <option value="Rugged">Rugged</option>
                    <option value="Luxury">Luxury</option>
                </select>
                <button 
                    className="btn-submit" 
                    onClick={handleHintRef}
                    type="submit" 
                    disabled={ navigation.state === "submitting" }
                >
                    Add Van
                </button>
            </Form>
        </section>
    )
}


function FormMessage({ message }) {
    return <h5 className="form-message">{message ? message : "Error. Try again later"}</h5>
}
