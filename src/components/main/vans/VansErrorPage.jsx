
import { 
    useRouteError,
    Link
} from "react-router-dom"


export default function VansErrorPage() {
    const error = useRouteError()  // not used YET
    return (
        <div style={elementStyle}>
            <h1>An error occured. Please,&nbsp;try&nbsp;again.</h1>
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
