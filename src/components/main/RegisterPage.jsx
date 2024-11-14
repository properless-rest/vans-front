// WARNING: in action() there are 2 approaches used 
// to validate the input data from the Form, however
// they don't collate great, which leads to not-simultaneous 
// error display


import { 
    Form, 
    Link,
    Navigate,
    useActionData,
    useNavigation,
    redirect
 } from "react-router-dom"

import { useAuth } from "../../App"
import { authorizeUser } from "../../utils/auth"


export async function action({ request, params }) {
    const formData = Object.fromEntries(await request.formData());
    const name = formData.name
    const surname = formData.surname
    const email = formData.email
    const password = formData.password
    const password2 = formData.password2
    if (! (name && surname && email && password && password2) ) return { message:"Fill in the input fields", status: 400 }
    if (!email.includes('@')) {
        return { message:"Wrong email format", status: 400, emailErr: true }
    }
    if (password !== password2) {
        return { message:"Passwords don't match", status: 400, pwErr: true }
    }
    try {
        // first param (type of operation) must correspond to the Backend URL part
        await authorizeUser("register", { name, surname, email, password })
        return redirect("/login?message=Registration successful")
    } catch(err) {
        return err
    }
}


export default function RegisterPage() {
    const { JWToken } = useAuth()
    if (JWToken) return <Navigate to="/user" />
    const actionData = useActionData()
    const navigation = useNavigation()
    return (
        <section className="auth-page">
            <h2 className="title">Create a new account</h2>
            {
            navigation.state === "idle" && actionData ? 
            <h4 className="err">{actionData.message ? actionData.message : "Error. Please, try again later"}</h4>
            :
            <h4 className="err-placeholder">X</h4> 
            }

            {
                /* replace param in Form substitutes the login page 
                    for the page the redirect took place from
                    in the browser history
                */
            }
            <Form method="post" className="auth-form" replace>
                <input
                    name="name"
                    type="text"
                    placeholder="First Name"
                    required
                    
                />
                <input
                    name="surname"
                    type="text"
                    placeholder="Last Name"
                    required
                />
                <input
                    className={actionData?.emailErr ? "wrong-input" : ""}
                    name="email"
                    type="email"
                    placeholder="Email address"
                    required
                />
                <input
                    className={actionData?.pwErr ? "wrong-input" : ""}
                    name="password"
                    type="password"
                    placeholder="Enter Password"
                    required
                />
                <input
                    className={actionData?.pwErr ? "wrong-input" : ""}
                    name="password2"
                    type="password"
                    placeholder="Confirm Password"
                    required
                />
                <button className="btn-submit" disabled={ navigation.state === "submitting" }>
                    SIGN UP
                </button>
            </Form>
            <h3 className="log-or-sign">Already have an account?<Link to="/login"> LOG&nbsp;IN</Link> </h3>
        </section>
    )
}

const errorStyle = { padding:"0.5rem 0", fontStyle: "italic", fontWeight:"bold", color: "red" }
