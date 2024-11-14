import { useState, useRef } from "react"
import { 
    useActionData, useNavigation, useOutletContext, 
    Navigate, Form } 
from "react-router-dom"

import { useAuth } from "../../App"

import { serverUrl } from "../../utils/serverUtils"

import separatorImg from "/svg/dotted-separator.svg"

import "../main/styles/ProfilePage.css"





export default function UserPage() {

    function handleFileChange(e) {
        const file = e.target.files[0]
        if (file) {
            let filename
            if (file.name.length > 35) {
                const splitByDots = file.name.split(".")
                const fileExtension = splitByDots.pop()
                filename = file.name.substring(0, 20) + `[...].${fileExtension}`
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

    const { user }= useOutletContext()
    if (!user) return <Navigate to="/login" />
    const { JWTRefresher, JWTExpiresSoon } = useAuth()
    // refresh the JWT every time this page is visited if JWTExpiresSoon
    JWTExpiresSoon() && JWTRefresher()
    const actionData = useActionData()
    const navigation = useNavigation()
    const [fileSelected, setFileSelected] = useState("No File Selected")
    const [pwHidden, setPWHidden] = useState(true)
    const imgHintRef = useRef(null)
    const dataHintRef = useRef(null)
    const passHintRef = useRef(null)
    const msgPlaceholder = <h5 className="message-placeholder">{"x"}</h5>
    return (
        <section className="user-page">
            <h3 className="username">{user.email}</h3>

            {
            navigation.state === "idle" && actionData && actionData.profileMsg ?
            <FormMessage message={actionData.message}/>
            :
            msgPlaceholder
            }

            <Form 
                ref={imgHintRef} tabIndex="-1" /* tabindex is needed for focusing with handleHintRefs() */
                method="post" className="user-form image-form" encType="multipart/form-data" replace>
                <img className="avatar" src={`${serverUrl}/${user.avatar}`} alt="Profile picture" />
                
                {
                navigation.state === "idle" && actionData && actionData.imgMsg ?
                <FormMessage message={actionData.message}/>
                :
                msgPlaceholder
                }

                <input className="user-input" hidden readOnly type="text" name="formType" value="updateImage" 
                       onChange={ () => { return } } /> {/* prevents malicious input tinkering from browser console */}
                <input
                    id="avatar" 
                    type="file" accept=".jpg, .jpeg, .png" 
                    onChange={handleFileChange} 
                    name="avatar" 
                    style={{ display: "none" }}  /* default browser input is hidden; customized with label+span below */
                />
                <div className="false-file-uploader">
                    <label className="false-input" htmlFor="avatar">Select File</label>
                    <span className="false-filename">{fileSelected}</span>
                </div>
                <button 
                    onClick={ () => handleHintRefs(imgHintRef) } 
                    type="submit" className="btn-submit" disabled={ navigation.state === "submitting" }
                >
                    Upload Profile Image
                </button>
            </Form>

            <img className="form-separator" src={separatorImg} alt="a separator for the forms" />

            <Form 
                ref={dataHintRef} tabIndex="-1" /* tabindex is needed for focusing with handleHintRefs() */
                method="put" className="user-form data-form" replace>
                <span className="form-title">Update User data</span>
                <input className="user-input" hidden readOnly type="text" name="formType" value="updateUser" 
                       onChange={ () => { return } } /> {/* prevents malicious input tinkering from browser console */}
                <input className="user-input" type="text" name="name" defaultValue={user.name} />
                <input className="user-input" type="text" name="surname" defaultValue={user.surname} />

                {
                navigation.state === "idle" && actionData && actionData.userMsg ?
                <FormMessage message={actionData.message}/>
                :
                msgPlaceholder
                }
                <div className="button-box">
                    <button 
                        onClick={ () => handleHintRefs(dataHintRef) } 
                        type="submit" className="btn-submit" disabled={ navigation.state === "submitting" }
                    >
                        Update
                    </button>
                    {/* adding type="button" to prevent the form reloading on Click UNDO */}
                    <button type="reset" className="btn-reset">
                        Reset
                    </button>
                </div>
            </Form>

            <img className="form-separator" src={separatorImg} alt="a separator for the forms" />

            <Form
                ref={passHintRef} tabIndex="-1" /* tabindex is needed for focusing with handleHintRefs() */         
                method="PUT" className="user-form password-form" replace>
                <span className="form-title">Change Your password</span>
                <input className="user-input" hidden readOnly type="text" name="formType" value="updatePass" 
                       onChange={ () => { return } } />  {/* prevents malicious input tinkering from browser console */}
                <input className="user-input" type={ pwHidden ? "password" : "text" } name="currentPassword" 
                        placeholder="Confirm your current password" 
                />
                <input className="user-input" type={ pwHidden ? "password" : "text" } name="newPassword1" placeholder="Enter the new password" />
                <input className="user-input" type={ pwHidden ? "password" : "text" } name="newPassword2" placeholder="Confirm the new password" />
                <div className="show-pw-box">
                    <input id="pw-show-box" type="checkbox" onClick={ () => setPWHidden( prevState => !prevState ) } />
                    <label htmlFor="pw-show-box">Show Passwords</label>
                </div>
                {
                navigation.state === "idle" && actionData && actionData.passMsg ?
                <FormMessage message={actionData.message}/>
                :
                msgPlaceholder
                }

                <button
                    onClick={ () => handleHintRefs(passHintRef) } 
                    className="btn-submit" disabled={ navigation.state === "submitting" }>
                    Change Password
                </button>
            </Form>
        </section>
    )
}


function FormMessage({ message }) {
    return <h5 className="form-message">{message ? message : "Error. Please, try again later"}</h5>
}
