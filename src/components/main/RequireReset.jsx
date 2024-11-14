import { 
    useActionData, useNavigation, 
    Form,
    redirect
} from "react-router-dom"

import { sendResetEmail } from "../../utils/auth";

import "./styles/RequireReset.css"


export async function action({ request, params }) {
    const formData = Object.fromEntries(await request.formData());
    const email = formData.email
    try {
        // first param (type of operation) must correspond to the Backend URL part
        await sendResetEmail({ email })
        return redirect("/login?message=Check Your email address")
    } catch(err) {
        return err
    }
}


export default function RequireReset() {
    const actionData = useActionData()
    const navigation = useNavigation()
    return (
        <section className="section-require-reset">
            <h2 className="title">Eneter your registered email&nbsp;address</h2>
            {
            navigation.state === "idle" && actionData ? 
            <h4 className="err">{actionData.message ? actionData.message : "Error. Please, try again later"}</h4>
            :
            <h4 className="err-placeholder" style={{ visibility: "hidden" }}>X</h4> 
            }
            <Form className="require-form" method="POST">
                <input type="email" name="email" placeholder="Your email address" required />
                <button 
                    type="submit" 
                    className="btn-submit" 
                    disabled={ navigation.state === "submitting" }
                >
                    Request Reset
                </button>
            </Form>
        </section>
    )
}
