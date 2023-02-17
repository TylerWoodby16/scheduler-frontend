import './App.css'
import Container from 'react-bootstrap/Container'
import Nav from 'react-bootstrap/Nav'
import Navbar from 'react-bootstrap/Navbar'
import { Link } from 'react-router-dom'
import { useLocation } from 'react-router-dom'
import Button from 'react-bootstrap/Button'
import { useNavigate } from 'react-router-dom'

const NavBar: React.FC = () => {
  const location = useLocation()
  const navigate = useNavigate()

  const LogOut = () => {
    localStorage.removeItem('token')
    navigate('/login')
  }

  // check token
  // set flag if has token flag = true
  // => hasToken = true or false

  /// need to figure out a way to make navbar re-render when the state of
  // our token changes (whether or not we have one)

  const hasToken = () => {
    const userToken = localStorage.getItem('token')
    if (userToken) {
      return true
    } else {
      return false
    }
  }

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
                className={hasToken() ? '' : 'd-none'}
                as={Link}
                to="/insertaircrafts"
              >
                Insert
              </Nav.Link>
              <Nav.Link
                className={hasToken() ? '' : 'd-none'}
                as={Link}
                to="/aircraftsupdate"
              >
                Update
              </Nav.Link>
              <Nav.Link
                className={hasToken() ? '' : 'd-none'}
                as={Link}
                to="/aircraftsdelete"
              >
                Delete
              </Nav.Link>
              <Nav.Link
                className={hasToken() ? '' : 'd-none'}
                as={Link}
                to="/profile"
              >
                Profile
              </Nav.Link>
              <Nav.Link as={Link} to="/signup">
                Signup
              </Nav.Link>
              <Nav.Link as={Link} to="/login">
                Login
              </Nav.Link>
              <Button
                className={hasToken() ? '' : 'd-none'}
                variant="success"
                onClick={() => LogOut()}
              >
                Log Out
              </Button>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  )
}

export default NavBar
