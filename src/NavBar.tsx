import './App.css'
import Container from 'react-bootstrap/Container'
import Nav from 'react-bootstrap/Nav'
import Navbar from 'react-bootstrap/Navbar'
import { Link } from 'react-router-dom'
import { useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'
import axios from 'axios'

type UserProp = {
  userLoggedIn: boolean
}

const NavBar: React.FC<UserProp> = ({ userLoggedIn }) => {
  const location = useLocation()
  const [aircrafts, setAircrafts] = useState<any>({})
  const getAircrafts = async () => {
    // We get an object that looks like {data:}
    const { data } = await axios.get<any>(
      `http://localhost:3001/aircraftsOther`
    )
    setAircrafts(data)
  }

  useEffect(() => {
    getAircrafts()
  }, [])

  return (
    <>
      <Navbar bg="light" expand="lg">
        <Container>
          <Navbar.Brand as={Link} to="/home">
            Flight-Hub
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link
                as={Link}
                to="/InsertAircrafts"
                className={
                  location.pathname != '/' &&
                  location.pathname != '/signup' &&
                  location.pathname != '/login'
                    ? ''
                    : 'd-none'
                }
              >
                Schedule
              </Nav.Link>
              <Nav.Link
                as={Link}
                to="/profile"
                className={
                  location.pathname != '/' &&
                  location.pathname != '/signup' &&
                  location.pathname != '/login'
                    ? ''
                    : 'd-none'
                }
              >
                Profile
              </Nav.Link>
              <Nav.Link
                as={Link}
                to="/maintenance"
                className={
                  location.pathname != '/' &&
                  location.pathname != '/signup' &&
                  location.pathname != '/login'
                    ? ''
                    : 'd-none'
                }
              >
                Maintenance
              </Nav.Link>
              <Nav.Link
                as={Link}
                to="/maintenancebackend"
                className={
                  location.pathname != '/' &&
                  location.pathname != '/signup' &&
                  location.pathname != '/login'
                    ? ''
                    : 'd-none'
                }
              >
                Maintenance Backend
              </Nav.Link>
              <Nav.Link as={Link} to="/signup">
                Signup
              </Nav.Link>
              <Nav.Link as={Link} to="/signupform">
                SignupForm
              </Nav.Link>
              <Nav.Link as={Link} to="/login">
                Login
              </Nav.Link>
              <Nav.Link as={Link} to="/backend">
                Backend
              </Nav.Link>
            </Nav>
            <div
              className={userLoggedIn == true ? aircrafts.lastName : 'd-none'}
            ></div>
          </Navbar.Collapse>

          {/* <div>{aircrafts.lastName}</div> */}
        </Container>
      </Navbar>
    </>
  )
}

export default NavBar
