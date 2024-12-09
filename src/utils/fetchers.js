
import { redirect } from "react-router-dom"

import axios from "axios"

import { serverUrl } from "./serverUtils"


// one function to fetch all the ones or just one by its UUID
async function fetchVans(vanUUID=null) {
    const fetchURL = vanUUID ? `${serverUrl}/vans/${vanUUID}` : `${serverUrl}/vans`
    try {
        const responce = await fetch(fetchURL)
        // server is online, but returns a responce not in 2##
        if (!responce.ok) {
            const data = await responce.json()
            throw {
                message: data.message ? data.message : ("Cannot load the van" + vanUUID ? "s" : "")
            }
        }
        const data = await responce.json()
        return data
    } catch (err) {
        // server is offline and does not respond;
        // or there is no network on your device;
        // or server raises an exception (error)
        if (err instanceof TypeError) {
            throw {
                message: "Server Error. Try again later"
            }
        }
        // server is online and the error occurs
        // during the execution of the Front-End code
        // (like during the parsing of res.json)
        // this also captures errors from the !res.ok block above
        throw {
            message: err.message ? err.message : "Internal Error. Try again later"
        }   // no <Form /> for the relevant pages (Vans; Van)
    }
}


async function fetchUser() {
    const fetchURL = `${serverUrl}/getUser`
    const JWToken = localStorage.getItem("JWToken")
    // don't throw here with __validateJWT(): the user is fetched at the top App level
    // and ErrorElement is render on throwing at the top level of the App
    if (!JWToken) return null
    try {
        axios.defaults.headers.common["Content-Type"] = "application/json"
        axios.defaults.headers.common["Authorization"] = `Bearer ` + localStorage.getItem("JWToken")
        const responce = await axios.get(fetchURL)
        delete axios.defaults.headers.common["Content-Type"]
        delete axios.defaults.headers.common["Authorization"]
        const data = responce.data  // not the same way as with fetch()
        return data
    } catch (err) {
        // if a user cannot be fetched (session expires), 
        // remove the JWT from localStorage and do a logout
        localStorage.removeItem("JWToken")  // DO NOT delete; else, expired JWTs don't trigger no logout
        localStorage.removeItem("RFToken")
        // if the JWT expires, flash a relevant message on the LoginPage
        return redirect("/logout?message=Session has expired. Please, LOG IN")  // it is a page with no JSX code
    }
}


function __validateJWT() {
    const JWToken = localStorage.getItem("JWToken")
    if (!JWToken) throw { message: "You are not authorized", status: 403, statusText: "Not authorized" }
}


// one function for updating UserData and UserPassword
async function updateUserData(operation, body) {
    // operation must match the corresponding view's route on the server
    const fetchURL = `${serverUrl}/${operation}`
    __validateJWT()
    try {
        const responce = await fetch(
            fetchURL, 
            {
                method: "PATCH",        
                headers: { "Content-Type": "application/json", "Authorization": `Bearer ${localStorage.getItem("JWToken")}` }, 
                body: JSON.stringify(body)
            }
        )
        // server is online, but returns a responce not in 2##
        if (!responce.ok) {
            const data = await responce.json()
            throw {
                message: data.message,
                userMsg: data.userMsg,
                passMsg: data.passMsg
            }
        }
        const data = await responce.json()
        return data
    } catch (err) {
        // server is offline and does not respond;
        // or there is no network on your device;
        // or server raises an exception (error)
        if (err instanceof TypeError) {
            throw {
                message: "Error. Try again later",
                userMsg: operation === "updateUser" ? true : false,
                passMsg: operation === "updatePassword" ? true : false,
            }
        }
        // server is online and the error occurs
        // during the execution of the Front-End code
        // (like during the parsing of res.json)
        // this also captures errors from the !res.ok block above
        throw {
            message: err.message, // message must be set in the file with <Form />;
            userMsg: operation === "updateUser" ? true : false,
            passMsg: operation === "updatePassword" ? true : false,
        }
    }
}


async function uploadProfileAvatar(formData) {
    const fetchURL = `${serverUrl}/uploadAvatar`
    __validateJWT()
    try {
        const responce = await fetch(
            fetchURL, 
            { 
                method: "POST",        
                headers: { "Authorization": `Bearer ${localStorage.getItem("JWToken")}` }, 
                body: formData
            }
        )
        // server is online, but returns a responce not in 2##
        if (!responce.ok) {
            const data = await responce.json()
            throw {
                message: data.message,
                imgMsg: data.imgMsg  // for ProfilePage: Form hints differentiation
            }
        }
        const data = await responce.json()
        return { message: data.message, imgMsg: true }
    } catch (err) {
        // server is offline and does not respond;
        // or there is no network on your device;
        // or server raises an exception (error)
        if (err instanceof TypeError) {
            throw {
                message: "Error. Try again later",
                imgMsg: true
            }
        }
        // server is online and the error occurs
        // during the execution of the Front-End code
        // (like during the parsing of res.json)
        // this also captures errors from the !res.ok block above
        throw { 
            message: err.message,  // message must be set in the file with <Form />;
            imgMsg: true
        }
    }
}


async function addVan(body) {
    const fetchURL = `${serverUrl}/addVan`
    __validateJWT()
    try {
        const responce = await fetch(
            fetchURL, 
            { 
                method: "POST",        
                headers: { "Content-Type": "application/json", "Authorization": `Bearer ${localStorage.getItem("JWToken")}` }, 
                body: JSON.stringify(body)
            }
        )
        // server is online, but returns a responce not in 2##
        if (!responce.ok) {
            const data = await responce.json()
            throw {
                message: data.message,
                dataMsg: data.dataMsg
            }
        }
        const data = await responce.json()
        return data
    } catch (err) {
        // server is offline and does not respond;
        // or there is no network on your device;
        // or server raises an exception (error)
        if (err instanceof TypeError) {
            throw {
                message: "Server Error. Try again later",
                dataMsg: true
            }
        }
        // server is online and the error occurs
        // during the execution of the Front-End code
        // (like during the parsing of res.json)
        // this also captures errors from the !res.ok block above
        throw { 
            message: err.message,  // message must be set in the file with <Form />;
            dataMsg: true
        }
    }
}


async function updateVanData(body) {
    const fetchURL = `${serverUrl}/updateVan`
    __validateJWT()
    try {
        const responce = await fetch(
            fetchURL, 
            { 
                method: "PATCH",        
                headers: { "Content-Type": "application/json", "Authorization": `Bearer ${localStorage.getItem("JWToken")}` }, 
                body: JSON.stringify(body)
            }
        )
        // server is online, but returns a responce not in 2##
        if (!responce.ok) {
            const data = await responce.json()
            throw {
                message: data.message,
                statusText: data.statusText,
                dataMsg: data.dataMsg,
            }
        }
        const data = await responce.json()
        return data
    } catch (err) {
        // server is offline and does not respond;
        // or there is no network on your device;
        // or server raises an exception (error)
        if (err instanceof TypeError) {
            throw {
                message: "Server Error",
                dataMsg: true
            }
        }
        // server is online and the error occurs
        // during the execution of the Front-End code
        // (like during the parsing of res.json)
        // this also captures errors from the !res.ok block above
        throw { 
            message: err.message,  // message must be set in the file with <Form />;
            dataMsg: true
        }
    }
}


async function uploadVanImage(formData) {
    const fetchURL = `${serverUrl}/uploadVanImage`
    __validateJWT()
    try {
        const responce = await fetch(
            fetchURL, 
            { 
                method: "POST",        
                headers: { "Authorization": `Bearer ${localStorage.getItem("JWToken")}` }, 
                body: formData
            }
        )
        // server is online, but returns a responce not in 2##
        if (!responce.ok) {
            const data = await responce.json()
            throw {
                message: data.message,
                statusText: data.statusText,
                status: data.status,
                imgMsg: data.imgMsg,
            }
        }
        const data = await responce.json()
        return data
    } catch (err) {
        // server is offline and does not respond;
        // or there is no network on your device;
        // or server raises an exception (error)
        if (err instanceof TypeError) {
            throw {
                message: "Server Error",
                imgMsg: true
            }
        }
        // server is online and the error occurs
        // during the execution of the Front-End code
        // (like during the parsing of res.json)
        // this also captures errors from the !res.ok block above
        throw { 
            message: err.message,  // message must be set in the file with <Form />;
            imgMsg: true
        }
    }
}


async function deleteVan(body) {
    const fetchURL = `${serverUrl}/deleteVan`
    __validateJWT()
    try {
        const responce = await fetch(
            fetchURL, 
            { 
                method: "DELETE",        
                headers: { "Content-Type": "application/json", "Authorization": `Bearer ${localStorage.getItem("JWToken")}` }, 
                body: JSON.stringify(body)
            }
        )
        // server is online, but returns a responce not in 2##
        if (!responce.ok) {
            const data = await responce.json()
            throw {
                message: data.message
            }
        }
        const data = await responce.json()
        return data
    } catch (err) {
        // server is offline and does not respond;
        // or there is no network on your device;
        // or server raises an exception (error)
        if (err instanceof TypeError) {
            throw {
                message: "Server Error"
            }
        }
        // server is online and the error occurs
        // during the execution of the Front-End code
        // (like during the parsing of res.json)
        // this also captures errors from the !res.ok block above
        throw { 
            message: err.message  // message must be set in the file with <Form />;
        }
    }
}


async function makeTransaction(body) {
    const fetchURL = `${serverUrl}/makeTransaction`
    // does not require authorization (JWT)
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
            throw {
                message: data.message,
                statusText: data.statusText,
                success: data.success
            }
        }
        const data = await responce.json()
        return data
    } catch (err) {
        // server is offline and does not respond;
        // or there is no network on your device;
        // or server raises an exception (error)
        if (err instanceof TypeError) {
            throw {
                message: "Server Error. Try again later"
            }
        }
        // server is online and the error occurs
        // during the execution of the Front-End code
        // (like during the parsing of res.json)
        // this also captures errors from the !res.ok block above
        throw { 
            message: err.message  // message must be set in the file with <Form />;
        }
    }
}


async function makeReview(body) {
    const fetchURL = `${serverUrl}/makeReview`
    // does not require authorization (JWT)
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
            throw {
                message: data.message,
                statusText: data.statusText,
                success: data.success,
            }
        }
        const data = await responce.json()
        return data
    } catch (err) {
        // server is offline and does not respond;
        // or there is no network on your device;
        // or server raises an exception (error)
        if (err instanceof TypeError) {
            throw {
                message: "Server Error. Try again later"
            }
        }
        // server is online and the error occurs
        // during the execution of the Front-End code
        // (like during the parsing of res.json)
        // this also captures errors from the !res.ok block above
        throw { 
            message: err.message  // message must be set in the file with <Form />;
        }
    }
}


export { 
    fetchVans, fetchUser, 
    updateUserData, uploadProfileAvatar, 
    addVan, deleteVan,
    uploadVanImage, updateVanData,
    makeTransaction,
    makeReview
}
