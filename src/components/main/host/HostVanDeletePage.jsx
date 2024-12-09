
import { 
    useActionData, useNavigation, useOutletContext, useParams,
    Form, Link, 
    redirect
} from "react-router-dom"

import { deleteVan } from "../../../utils/fetchers"

import "../styles/host/HostVanDelete.css"



// ! CAVEAT: DO NOT SWITCH TO handleSubmit() paradigm [no data router]
//           because navigate("/host") does not reload user.vans automatically
//           resulting in the previous list of vans being displayed (with the deleted van)


export async function action({ request, params }) {
    const formData = Object.fromEntries(await request.formData());
    const vanUUID = formData.vanUUID
    try {
        const data = await deleteVan({ vanUUID })
        if (data.success) return redirect("/host")
        return data  // if the responce status is not a success, return the err.msg
    } catch(err) {
        return err
    }
}


export default function HostVanDeletePage() {

    const { user } = useOutletContext()
    const { vanUUID } = useParams()
    const van = user.vans.find( van => van.uuid === vanUUID )
    if (!van) return (
        <div style={{ height: "100%", display: "flex", alignItems:"center", justifyContent:"center" }}>
            <h2>The Van does not exist</h2>
        </div>
    )
    const navigation = useNavigation()
    const actionData = useActionData()
    return (
        <section className="van-delete">
            <h3 className="title">Do you confirm the deletion of&nbsp;the&nbsp;Van?</h3>
            <span className="van-name">{van.name}</span>
            {
            actionData && navigation.state === "idle" ?
            <h5 className="form-message">{actionData.message || "Error. Try again later."}</h5>
            :
            <h5 className="message-placeholder" style={{ visibility: "hidden" }}>X</h5>
            }
            <div className="btn-container">
                <Form method="DELETE">
                <input className="van-input" hidden readOnly required type="text" name="vanUUID" defaultValue={van.uuid} />
                <button className="btn-delete" type="submit"
                    // onClick={handleSubmit}
                    disabled={ navigation.state === "submitting" }
                >
                    DELETE
                </button>
                </Form>

                <Link className="return-link" to="..">
                    <button className="btn-undo"> 
                        RETURN
                    </button>
                </Link>
            </div>
        </section>
    )
}
