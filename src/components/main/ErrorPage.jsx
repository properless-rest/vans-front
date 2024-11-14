
import { 
    useRouteError,
    Link
} from "react-router-dom"


export default function ErrorPage() {
    const error = useRouteError()  // not used YET
    return (
        <div style={elementStyle}>
            {
            error.status == 404 ?
            <h1>This page does not&nbsp;exist.</h1>
            :
            <h1>An error occurred. Plase, try again later.</h1>
            }
            <Link 
                to="/"
                style={linkStyle}
            >
                Back to Home Page
            </Link>
        </div>
    )
}


const elementStyle = { 
    width: "100vw",
    height: "100vh",
    display: "flex", 
    flexDirection: "column", 
    justifyContent:"center", 
    gap: "1rem", 
    padding: "0.25rem", 
    textAlign: "center",
    backgroundColor: "#F7F7ED",
    color: "#161616"
}


const linkStyle = { color: "inherit", fontWeight: "600", fontSize: "1.5rem", textUnderlineOffset: "3px" }
