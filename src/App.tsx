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
import AircraftDetails from './AircraftDetails'
import Profile from './Profile'

export default function App() {
  const Landing = () => (
    <div>
      <h1>LANDING PAGE</h1>
    </div>
  )

  return (
    <div>
      <NavBar />
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
          path="/aircraftdetails/:id"
          element={
            <RequireAuth>
              <AircraftDetails />
            </RequireAuth>
          }
        />
        <Route
          path="/profile"
          element={
            <RequireAuth>
              <Profile />
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