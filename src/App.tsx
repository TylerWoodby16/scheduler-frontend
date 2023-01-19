import { Routes, Route } from 'react-router-dom'
import Aircrafts from './Aircrafts'
import AircraftsUpdate from './AircraftsUpdate'
import Home from './Home'
import Login from './Login'
import { RequireAuth } from './RequireAuth'
import SignupForm from './Signup'
import AircraftsUpdateGentle from './AircraftsUpdateGentle'

export default function App() {
  const Landing = () => (
    <div>
      <h1>LANDING PAGE</h1>
    </div>
  )

  return (
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
        path="/aircrafts"
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
      
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignupForm />} />
    </Routes>
  )
}
