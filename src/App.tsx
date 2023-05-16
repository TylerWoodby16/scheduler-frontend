import { Routes, Route } from 'react-router-dom'
import AircraftInsert from './AircraftInsert'
import Aircrafts from './Aircrafts'
import Login from './Login'
import { RequireAuth } from './RequireAuth'
import SignupForm from './Signup'
import './App.css'
import NavBar from './NavBar'
import AircraftDetails from './AircraftDetails'
import Profile from './profile/Profile'
import Schedule from './Schedule'

export default function App() {
  const Landing = () => (
    <div>
      <h1>LANDING PAGE</h1>
    </div>
  )

  return (
    <div className="app">
      <NavBar />
      <Routes>
        <Route
          path="/schedule"
          element={
            <RequireAuth>
              <Schedule />
            </RequireAuth>
          }
        />

        <Route
          path="/aircrafts"
          element={
            <RequireAuth>
              <Aircrafts />
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
          path="/aircrafts/new"
          element={
            <RequireAuth>
              <AircraftInsert />
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
