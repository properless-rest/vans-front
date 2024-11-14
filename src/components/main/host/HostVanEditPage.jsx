import { useState, useRef } from "react"

import { 
    useOutletContext, useParams, useNavigation, useActionData,
    Form 
} from "react-router-dom"

import { updateVanData, uploadVanImage } from "../../../utils/fetchers";
import { serverUrl } from "../../../utils/serverUtils";

import "../styles/host/HostVanEdit.css"


export async function action({ request, params }) {
    const formData = Object.fromEntries(await request.formData());
    const formType = formData.formType
    // protection from malicious browser manipulations in the console
    if (formType !== "updateData" && formType !== "updateImage") {
        return { message: "Forbidden form type", status: 400, profileMsg: true }
    }
    if (formType === "updateImage") {
        const image = formData.image
        // protection from manipulations with input TYPE (file) and NAME (image) change in browser console
        if (!(image instanceof File)) {
            return { message: "Invalid file", imgMsg: true }
        }
        const vanUUID = formData.vanUUID
        const imageData = new FormData()
        imageData.append("image", image)
        imageData.append("vanUUID", vanUUID)
        try {
            return await uploadVanImage(imageData)
        } catch(err) {
            return err
        }
    }
    else if (formType === "updateData") {
        const vanUUID = formData.vanUUID
        const description = formData.description
        const name = formData.name
        const pricePerDay = formData.pricePerDay
        const type = formData.type
        if (!(name && description && pricePerDay && type)) return { message: "Fill in every field", status:400, dataMsg: true }
        if (type !== "Simple" && type !== "Rugged" && type !== "Luxury" ) {
            return { message: "Invalid Van type", status:400, dataMsg: true }
        }
        try {
            return await updateVanData({ vanUUID, description, name, pricePerDay, type })
        } catch(err) {
            return err
        }
    }
}


export default function HostVanEditPage() {

    function handleFileChange(e) {
        const file = e.target.files[0]
        if (file) {
            let filename
            if (file.name.length > 30) {
                const splitByDots = file.name.split(".")
                const fileExtension = splitByDots.pop()
                filename = file.name.substring(0, 18) + `[...].${fileExtension}`
            }
            else filename = file.name
            setFileSelected(filename)
        }
        else setFileSelected("No File Selected")
    }

    function handleHintRefs(hintRef) {
        if (hintRef.current) {
            hintRef.current.scrollIntoView()
        }
    }

    const { user } = useOutletContext()
    const { vanUUID } = useParams()
    const van = user.vans.find( van => van.uuid === vanUUID )
    if (!van) return (
        <div style={{ height: "100%", display: "flex", alignItems:"center", justifyContent:"center" }}>
            <h2>The Van does not exist</h2>
        </div>
    )
    const [fileSelected, setFileSelected] = useState("No file Selected")
    const actionData = useActionData()
    const navigation = useNavigation()
    const imgHintRef = useRef(null)
    const dataHintRef = useRef(null)
    const msgPlaceholder = <h5 className="message-placeholder" style={{ visibility: "hidden" }}>{"x"}</h5>
    return (
        <section className="van-update">
            <h2 className="title">Update the Van Data</h2>
            {
            navigation.state === "idle" && actionData && actionData.profileMsg ?
            <FormMessage message={actionData.message}/>
            :
            msgPlaceholder
            }
            <div className="box-with-forms">    
                <Form 
                    className="van-form image-form" method="POST" encType="multipart/form-data"
                >
                    <img className="van-image" src={`${serverUrl}/${van.image}`} alt="Van image" />
                    <div 
                        className="image-focus"
                        ref={imgHintRef} tabIndex="-1" /* tabindex is needed for focusing with handleHintRefs() */     
                    />
                    {
                        navigation.state === "idle" && actionData && actionData.imgMsg ?
                        <FormMessage message={actionData.message}/>
                        :
                        msgPlaceholder
                    }
                    <input className="van-input" hidden readOnly type="text" name="formType" value="updateImage" 
                        onChange={ () => { return } } /> {/* prevents malicious input tinkering from browser console */}
                    <input className="van-input" hidden readOnly required type="text" name="vanUUID" defaultValue={van.uuid} />
                    <input
                        id="image" 
                        type="file" accept=".jpg, .jpeg, .png" 
                        onChange={handleFileChange}
                        name="image"
                        style={{ display: "none" }}  /* default browser input is hidden; customized with label+span below */
                    />
                    <div className="van-file-uploader"> {/* don't name it 'false-file-uploader': conflicts with ProfilePage.css */}
                        <label className="false-input" htmlFor="image">Select File</label>
                        <span className="false-filename">{fileSelected}</span>
                    </div>
                    <button 
                        onClick={ () => handleHintRefs(imgHintRef) } 
                        type="submit" className="btn-submit" disabled={ navigation.state === "submitting" }
                    >
                        Upload Image
                    </button>
                </Form>

                <Form 
                    className="van-form data-form" method="POST"
                >   
                    <div 
                        className="data-hint-focus" 
                        ref={dataHintRef} tabIndex="-1" /* tabindex is needed for focusing with handleHintRefs() */   
                    />
                    {
                        navigation.state === "idle" && actionData && actionData.dataMsg ?
                        <FormMessage message={actionData.message}/>
                        :
                        msgPlaceholder
                    }
                    <input className="van-input" hidden readOnly type="text" name="formType" value="updateData" 
                            onChange={ () => { return } } /> {/* prevents malicious input tinkering from browser console */}
                    <input className="van-input" hidden readOnly required type="text" name="vanUUID" defaultValue={van.uuid} />
                    <input 
                        className="van-input first-input" 
                        placeholder="Van Name" 
                        type="text" 
                        name="name" 
                        defaultValue={van.name} 
                        required 
                    />
                    <textarea 
                        className="van-textarea" 
                        draggable={false} 
                        placeholder="Van Description"
                        rows={5}
                        name="description" 
                        defaultValue={van.description} 
                        required 
                    />
                    <input 
                        className="van-input" 
                        placeholder="Price per Day"
                        type="number" 
                        name="pricePerDay" 
                        defaultValue={van.pricePerDay} 
                        required 
                        min={1} 
                    />
                    <select className="van-select" name="type" defaultValue={van.type} required>
                        <option value="Simple">Simple</option>
                        <option value="Rugged">Rugged</option>
                        <option value="Luxury">Luxury</option>
                    </select>
                    <div className="btn-box">
                        <button 
                            onClick={ () => handleHintRefs(dataHintRef) }
                            type="submit" disabled={ navigation.state === "submitting" }
                        >
                            Update
                        </button>
                        <button className="btn-reset" type="reset">Undo</button>
                    </div>
                </Form>
            </div>
        </section>
    )
}


function FormMessage({ message }) {
    return <h5 className="form-message">{message ? message : "Error. Try again later"}</h5>
}
