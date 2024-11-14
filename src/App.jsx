import { 
  createBrowserRouter, createRoutesFromElements, 
  Route, RouterProvider,
  Navigate,
  useLocation
} from "react-router-dom"

import { 
  createContext, 
  useContext, useEffect, useState 
} from "react"

import PageLayout, { loader as layoutUserLoader } from "./pages/pageLayout"
import ErrorPage from "./components/main/ErrorPage"
import HomePage from "./components/main/HomePage"
import AboutPage from "./components/main/AboutPage"
//
import VansPage, { loader as vansPageLoader } from "./components/main/vans/VansPage"
import VanPage, { loader as vanPageLoader } from "./components/main/vans/VanPage"
import VanPageView from "./components/main/vans/VanPageView"
import VansErrorPage from "./components/main/vans/VansErrorPage"
import MakeTransaction, { action as transactionAction } from "./components/main/vans/MakeTransaction"
import MakeReview from "./components/main/vans/MakeReview"
//
import RegisterPage, { action as registerAction }  from "./components/main/RegisterPage"
import LoginPage from "./components/main/LoginPage"
import RequireReset, {action as reqResetAction} from "./components/main/RequireReset"
import ResetPassword, {loader as resetLoader, action as resetAction} from "./components/main/ResetPassword"
import UserPage from "./components/main/UserPage"
// this user action was put into a separate file because of occurring error
// on the UserPage: read the header comment of the `userAction.js`
import { action as userAction } from "./components/main/UserPageAction.js"
//
import HostLayoutProtected from "./components/main/host/HostLayout"
import HostDashboardPage from "./components/main/host/HostDashboardPage"
import HostIncomePage from "./components/main/host/HostIncomePage"
import HostVansPage from "./components/main/host/HostVansPage"
import HostAddVanPage, { action as VanAddAction } from "./components/main/host/HostAddVanPage"
import HostVanPageLayout, 
      { 
        HostVanDetails,
        HostVanPricing,
        HostVanPhotos
      } from "./components/main/host/HostVanPageComposition"
import HostVanEditPage, { action as VanEditAction } from "./components/main/host/HostVanEditPage"
import HostVanDeletePage, { action as VanDeleteAction }  from "./components/main/host/HostVanDeletePage"
import HostReviewsPage from "./components/main/host/HostReviewsPage"

import { refreshJWT } from "./utils/auth"
import './App.css'


function Logout({ setJWToken, setRFToken }) {
  // do not delete this line (despite extra removeItem in `fetchUser`)
  // it is needed for a deliborate logout (on logout click)
  localStorage.removeItem("JWToken")
  localStorage.removeItem("RFToken")
  // will spawn a rendering error which requires F5 without using `useEffect`; Do NOT remove useEffect!
  // alternatively, try wrapping the `setJWToken(null)` in a setTimeout func;
  useEffect(() => {setJWToken(null); setRFToken(null)}, []) 
  // a message will come from `fetchUser()` if JWT expires, but not after a deliberate LOGOUT
  const location= useLocation()
  const params = new URLSearchParams(location.search)
  const message = params.get('message')
  // if there is a message (JWT has expired), go to a login page with a message; else - go to the index page
  const navRoute = message ? <Navigate to={`/login?message=${message}`} /> : <Navigate to="/" />
  return navRoute
}


const AuthContext = createContext()


export function useAuth() {
  return useContext(AuthContext)
}


export default function App() {

  // 300 secs. is 5 mins. before the expiration
  function JWTExpiresSoon(bufferTimeSecs = 300) {
    const tokenPayload = JSON.parse(atob(JWToken.split('.')[1]))
    const currentTime = Math.floor(Date.now() / 1000)
    // expiration time - now is less than n seconds
    return (tokenPayload.exp - currentTime) < bufferTimeSecs
}

  // NOTE: this function is called inside HostLayout and UserPage to refresh the JWT
  async function JWTRefresher() {
    try {
      const { JWToken } = await refreshJWT()
      localStorage.setItem("JWToken", JWToken)
      setJWToken(JWToken)
    } catch(err) {
      return null
    }
  }


  // implements AUTH with a JWToken
  const [JWToken, setJWToken] = useState(localStorage.getItem("JWToken"))  // access  token
  const [RFToken, setRFToken] = useState(localStorage.getItem("RFToken"))  // refresh token
  const browserRouter = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<PageLayout/>} loader={layoutUserLoader} errorElement={<ErrorPage/>}>
        <Route index element={<HomePage/>} />
        <Route path="about" element={<AboutPage/>} />
        <Route path="vans" element={<VansPage/>} loader={vansPageLoader} errorElement={<VansErrorPage/>} />
        <Route path="vans/:vanUUID" element={<VanPage/>} loader={vanPageLoader} errorElement={<VansErrorPage/>} >
          <Route index element={<VanPageView/>} />
          <Route path="rent" element={<MakeTransaction/>} action={transactionAction} />
          <Route path="review" element={<MakeReview/>} />
        </Route>
        <Route path="register" element={<RegisterPage/>} action={registerAction} />
        <Route path="reset-password" element={<RequireReset/>} action={reqResetAction} />
        <Route path="reset-password/:token" element={<ResetPassword/>} loader={resetLoader} action={resetAction} />
        <Route path="login" element={<LoginPage/>} />
        <Route path="logout" element={<Logout setJWToken={setJWToken} setRFToken={setRFToken} />} />
        <Route path="user" element={<UserPage />} action={userAction} />
        <Route path="host" element={<HostLayoutProtected/>} >
          <Route index element={<HostDashboardPage/>} />
          <Route path="income" element={<HostIncomePage/>} />
          <Route path="vans" element={<HostVansPage/>} />
          <Route path="vans/add" element={<HostAddVanPage/>} action={VanAddAction} />
          <Route path="vans/:vanUUID" element={<HostVanPageLayout/>}>
            <Route index element={<HostVanDetails/>} />
            <Route path="pricing" element={<HostVanPricing />} />
            <Route path="photos" element={<HostVanPhotos />} />
          </Route>
          <Route path="vans/:vanUUID/edit" element={<HostVanEditPage/>} action={VanEditAction} />
          <Route path="vans/:vanUUID/delete" element={<HostVanDeletePage/>} action={VanDeleteAction} />
          <Route path="reviews" element={<HostReviewsPage/>} />
        </Route>
      </Route>
    )
  )
  return (
    <>
      <AuthContext.Provider value={{ JWToken, setJWToken, RFToken, setRFToken, JWTRefresher, JWTExpiresSoon }}>
        <RouterProvider router={browserRouter} />
      </AuthContext.Provider>
    </>
  )
}
