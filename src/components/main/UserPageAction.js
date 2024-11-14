// the reason this particular action function
// was put out of the relevant `.jsx` file
// is that the `UserPage.jsx` cannot hot-reload
// with this action function put into the same file
// ERROR: [vite] invalidate /src/components/main/UserPage.jsx: Could not Fast Refresh ("action" export is incompatible)


import { updateUserData, uploadProfileAvatar } from "../../utils/fetchers"


export async function action({ request, params }) {
    const formData = Object.fromEntries(await request.formData());
    const formType = formData.formType
    // protection from malicious browser manipulations in the console
    if (formType !== "updateUser" && formType !== "updatePass" && formType !== "updateImage") {
        return { message: "Forbidden form type", status: 400, profileMsg: true }
    }
    // form user update path
    if (formType === "updateImage") {
        const avatar = formData.avatar
        // protection from manipulations with input TYPE (file) and NAME (avatar) change in browser console
        if (!(avatar instanceof File)) {
            return { message: "Invalid file", imgMsg: true }
        }
        const imageData = new FormData()
        imageData.append("avatar", avatar)
        try {
            return await uploadProfileAvatar(imageData)
        } catch(err) {
            return err
        }
    }
    else if (formType === "updateUser") {
        const name = formData.name
        const surname = formData.surname
        if (!name.length || !surname.length ) return { message: "Input cannot be empty", status:400, userMsg: true }
        try {
            // first param must match the backend view's route
            return await updateUserData(
                "updateUser", { name, surname }
            )
        } catch(err) {
            return err
        }
    }
    // form password update path
    else if (formType === "updatePass") {
        const currentPassword = formData.currentPassword
        const newPassword1 = formData.newPassword1
        const newPassword2 = formData.newPassword2
        if (!currentPassword || !newPassword1 || !newPassword2) return { message: "Fill in every field", passMsg: true }
        if (newPassword1 !== newPassword2) return { message: "Passwords don't match", passMsg: true }
        try {
            // first param must match the backend view's route
            return await updateUserData(
                "updatePassword", { currentPassword, newPassword: newPassword1 }
            )
        } catch(err) {
            return err
        }
    }
}
