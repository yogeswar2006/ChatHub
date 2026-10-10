
import React, { useEffect } from 'react'
import { Route, Routes } from 'react-router'
import ChatPage from './pages/ChatPage'
import LoginPage from './pages/loginPage'
import SignupPage from './pages/signupPage'
import { useAuthStore } from './store/useAuthStore'
import { Navigate } from 'react-router'
import PageLoader from './components/PageLoader'
import {Toaster} from "react-hot-toast"

function App() {
  const {isCheckingAuth,checkAuth,authUser}=useAuthStore()

  useEffect(()=>{
    checkAuth()
  },[checkAuth])

  console.log("authUser",authUser)
  if(isCheckingAuth) return <PageLoader/>

  return (
    <div className="relative isolate min-h-screen overflow-hidden bg-slate-950">

      {/* Background gradient */}
      <div className="pointer-events-none absolute inset-0 z-0 bg-gradient-to-br from-slate-950 via-slate-900 to-zinc-950" />
      {/* Ambient glow shapes */}
      <div className="pointer-events-none absolute top-10 left-1/4 z-0 size-72 rounded-full bg-indigo-500/10 blur-[100px]" />
      <div className="pointer-events-none absolute right-1/4 bottom-10 z-0 size-96 rounded-full bg-violet-500/10 blur-[120px]" />
      <div className="pointer-events-none absolute top-1/2 left-1/2 z-0 size-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-500/5 blur-[100px]" />

      {/* Page content */}
      <div className="relative z-10 flex min-h-screen items-center justify-center p-4">
        <Routes>
          <Route path="/" element={authUser ? <ChatPage /> :<Navigate to={"/login"} /> } />
          <Route path="/login" element={!authUser? <LoginPage />:<Navigate to={"/"} />} />
          <Route path="/signup" element={!authUser? <SignupPage />:<Navigate to={"/"} /> } />
        </Routes>

        <Toaster/>
      </div>

    </div>
  )
}

export default App
