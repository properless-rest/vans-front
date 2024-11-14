import { useState } from "react"

import { 
    useLoaderData, useActionData, useNavigation,
    Navigate, Form, 
    redirect
} from "react-router-dom"

import { validateToken, resetPassword } from "../../utils/auth"

import "./styles/ResetPassword.css"


export async function loader({ request, params }) {
    const token = params['token']
    const data = await validateToken({ token })
    return data
}


export async function action({ request, params }) {
    const formData = Object.fromEntries(await request.formData());
    const newPassword = formData.newPassword
    const confirmPassword = formData.confirmPassword
    if (! (newPassword && confirmPassword)) return { message: "Fill in every field" }
    if (newPassword != confirmPassword) return { message: "Passwords don't match" }
    const token = params['token']
    try {
        // first param (type of operation) must correspond to the Backend URL part
        await resetPassword({ newPassword, token })
        return redirect("/login?message=Password changed succesfully")
    } catch(err) {
        return err
    }
}


export default function ResetPassword() {
    const data = useLoaderData()
    const [pwHidden, setPwHidden] = useState(true)
    if (! data.tokenValid) return <Navigate to="/login?message=Token is invalid or has expired" />
    const navigation = useNavigation()
    const actionData = useActionData()
    return (
        <section className="section-reset-passwords">
            <h2 className="title">Eneter your new password</h2>
            {
            navigation.state === "idle" && actionData ? 
            <h4 className="err">{actionData.message ? actionData.message : "Error. Please, try again later"}</h4>
            :
            <h4 className="err-placeholder" style={{ visibility: "hidden" }}>X</h4> 
            }
            <Form method="POST" className="reset-form">
                <input type={pwHidden ? "password" : "text"} name="newPassword" placeholder="New Password" required/>
                <input type={pwHidden ? "password" : "text"} name="confirmPassword" placeholder="Confirm Password" required />
                <div className="checkbox-container">
                    <input id="show-pw-box" type="checkbox" onClick={ () => setPwHidden( prevState => !prevState ) } />
                    <label htmlFor="show-pw-box">Show passwords</label>
                </div>
                <button 
                    type="submit" 
                    className="btn-submit" 
                    disabled={ navigation.state === "submitting" }
                >
                    Reset Password
                </button>
            </Form>
        </section>
    )
}
