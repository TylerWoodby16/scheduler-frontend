import { Routes, Route } from 'react-router-dom'
import Aircrafts from './InsertAircrafts'
import AircraftsUpdate from './AircraftsUpdate'
import Home from './Home'
import Login from './Login'
import { RequireAuth } from './RequireAuth'
import SignupForm from './Signup'
import AircraftsUpdateGentle from './AircraftsUpdateGentle'
import AircraftsDelete from './AircraftsDelete'
import './App.css'
import NavBar from './NavBar'
import { useState, useEffect } from 'react'

export default function App() {
  const Landing = () => (
    <div>
      <h1>LANDING PAGE</h1>
    </div>
  )

  const [userLoggedIn, setUserLoggedIn] = useState(false)
  const AddUserLoggedIn = () => {
    setUserLoggedIn(true)
  }

  return (
    <div>
      <NavBar userLoggedIn={userLoggedIn} />
      <Routes>
        <Route
          path="/home"
          element={
            <RequireAuth>
              <Home />
            </RequireAuth>
          }
        />
        <Route
          path="/insertaircrafts"
          element={
            <RequireAuth>
              <Aircrafts />
            </RequireAuth>
          }
        />
        <Route
          path="/aircraftsupdate"
          element={
            <RequireAuth>
              <AircraftsUpdate />
            </RequireAuth>
          }
        />
        <Route
          path="/aircraftsupdategentle"
          element={
            <RequireAuth>
              <AircraftsUpdateGentle />
            </RequireAuth>
          }
        />
        <Route
          path="/aircraftsdelete"
          element={
            <RequireAuth>
              <AircraftsDelete />
            </RequireAuth>
          }
        />

        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignupForm />} />
      </Routes>
    </div>
  )
}
