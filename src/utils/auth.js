import { serverUrl } from "./serverUtils"

import axios from "axios"


// one function for Register and Login
async function authorizeUser(action, requestBody) {
    const fetchURL = `${serverUrl}/${action}`
    try {
        const res = await fetch(
            fetchURL,
            { 
                method: "POST",             
                headers: { "Content-Type": "application/json" }, 
                body: JSON.stringify(requestBody) 
            }
        )
        // server is online, but returns a responce not in 2##
        if (!res.ok) {
            const data = await res.json()
            throw { 
                message: data.message,
                emailErr: data.emailErr,  // used for styling in auth forms
                pwErr: data.pwErr         // used for styling in auth forms
            }
        }
        const data = await res.json()
        return data
    } catch (err) {
        // server is offline and does not respond;
        // or there is no network on your device;
        // or server raises an exception (error)
        if (err instanceof TypeError) {
            throw {
                message: "Error. Try again later"
            }
        }
        // server is online and the error occurs
        // during the execution of the Front-End code
        // (like during the parsing of res.json)
        // this also captures errors from the !res.ok block above
        throw err  // message must be set in the file with <Form />; 
    }
}


async function refreshJWT() {
    const fetchURL = `${serverUrl}/refreshToken`
    const RFToken = localStorage.getItem("RFToken")
    if (!RFToken) return null  // no need to throw here
    try {
        const axiosRefresher = axios.create(
            {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ` + localStorage.getItem("RFToken")
                }
            }
        )
        const responce = await axiosRefresher.post(fetchURL)
        const data = responce.data  // not the same way as with fetch()
        return data
    } catch (err) {
        // if the refreshing was not successful, do not do anything
        return null
    }
}


async function sendResetEmail(requestBody) {
    const fetchURL = `${serverUrl}/sendReset`
    try {
        const res = await fetch(
            fetchURL,
            { 
                method: "POST",             
                headers: { "Content-Type": "application/json" }, 
                body: JSON.stringify(requestBody) 
            }
        )
        // server is online, but returns a responce not in 2##
        if (!res.ok) {
            const data = await res.json()
            throw { 
                message: data.message,
            }
        }
        const data = await res.json()
        return data
    } catch (err) {
        // server is offline and does not respond;
        // or there is no network on your device;
        // or server raises an exception (error)
        if (err instanceof TypeError) {
            throw {
                message: "Error. Try again later"
            }
        }
        // server is online and the error occurs
        // during the execution of the Front-End code
        // (like during the parsing of res.json)
        // this also captures errors from the !res.ok block above
        throw err  // message must be set in the file with <Form />; 
    }
}


async function validateToken(requestBody) {
    const fetchURL = `${serverUrl}/validateToken`
    try {
        const res = await fetch(
            fetchURL,
            { 
                method: "POST",             
                headers: { "Content-Type": "application/json" }, 
                body: JSON.stringify(requestBody) 
            }
        )
        // server is online, but returns a responce not in 2##
        if (!res.ok) {
            const data = await res.json()
            throw { 
                message: data.message,
            }
        }
        const data = await res.json()
        return data
    } catch (err) {
        // server is offline and does not respond;
        // or there is no network on your device;
        // or server raises an exception (error)
        if (err instanceof TypeError) {
            throw {
                message: "Error. Try again later"
            }
        }
        // server is online and the error occurs
        // during the execution of the Front-End code
        // (like during the parsing of res.json)
        // this also captures errors from the !res.ok block above
        throw err  // message must be set in the file with <Form />; 
    }
}

async function resetPassword(body) {
    // operation must match the corresponding view's route on the server
    const fetchURL = `${serverUrl}/resetPassword`
    try {
        const responce = await fetch(
            fetchURL, 
            {
                method: "POST",        
                headers: { "Content-Type": "application/json" }, 
                body: JSON.stringify(body)
            }
        )
        // server is online, but returns a responce not in 2##
        if (!responce.ok) {
            const data = await responce.json()
            throw { message: data.message }
        }
        const data = await responce.json()
        return data
    } catch (err) {
        // server is offline and does not respond;
        // or there is no network on your device;
        // or server raises an exception (error)
        if (err instanceof TypeError) {
            throw { message: "Error. Try again later" }
        }
        // server is online and the error occurs
        // during the execution of the Front-End code
        // (like during the parsing of res.json)
        // this also captures errors from the !res.ok block above
        throw {
            message: err.message, // message must be set in the file with <Form />;
        }
    }
}


export { authorizeUser, refreshJWT, sendResetEmail, validateToken, resetPassword }
