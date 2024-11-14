import { useState, useRef } from "react"


import { 
    Link, Navigate,
    useNavigate, useOutletContext, useLocation,
    redirect
 } from "react-router-dom"

import { useAuth } from "../../App"
import { authorizeUser } from "../../utils/auth"


import "./styles/AuthPages.css"


export default function LoginPage() {

    function handleHintRef() {
        if (hintRef.current) {
            hintRef.current.scrollIntoView()
          }
    }

    async function handleSubmit(e) {
        e.preventDefault()
        setError(null)
        setNavState("submitting")
        if (!(email && password)) {
            setError({ message:"Fill in the input fields", status: 400 })
            setNavState("idle")
            return null
        }
        if (!email.includes("@")) {
            setError({ message: "Inadmissible email format", status: 400 })
            setNavState("idle")
            return null
        }
        try {
            const { JWToken, RFToken } = await authorizeUser("login", { email, password })
            localStorage.setItem("JWToken", JWToken)
            localStorage.setItem("RFToken", RFToken)
            setJWToken(JWToken)
            setRFToken(RFToken)
            navigate("/host")
        } catch(err) {
            setError(err)
            return err
        } finally {
            setNavState("idle")
        }
    }
    
    const { user } = useOutletContext()
    const { setJWToken, setRFToken } = useAuth()
    if (user) return <Navigate to="/host" />
    const location= useLocation()
    const params = new URLSearchParams(location.search);
    const message = params.get('message');
    // when redirected from a register page, set to a success message; else - null;
    // success must be set as an object with field `message` due to how errors are displayed below;
    const [error, setError] = useState(message ? { message } : null)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [navState, setNavState] = useState("idle")
    const hintRef = useRef(null)
    const navigate = useNavigate()
    return (
        <section className="auth-page">
            <h2 ref={hintRef} className="title">Sign into your account</h2>
            {
            error ?
            <h4 className="err">{error.message ? error.message : "Error. Please, try again later"}</h4>
            :
            <h4 className="err-placeholder">X</h4> 
            }

            <form onSubmit={handleSubmit} className="auth-form">
            <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email address"
                required
                autoComplete={email}
            />
            <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                required
                autoComplete={password}
            />
            <button 
                className="btn-submit"
                onClick={handleHintRef}
                disabled={navState === "submitting" ? true : false}
            >
                {navState === "submitting"
                    ? "Logging in..."
                    : "LOG IN"
                }
            </button>
        </form>
            <h3 className="log-or-sign">Don't have an account yet?<Link to="/register"> SIGN&nbsp;UP</Link> </h3>
            <h3 className="log-or-sign">Forgot your password?<Link to="/reset-password"> RESET</Link> </h3>
        </section>
    )
}
