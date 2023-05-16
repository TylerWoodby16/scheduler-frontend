import './App.css'
import Container from 'react-bootstrap/Container'
import Nav from 'react-bootstrap/Nav'
import Navbar from 'react-bootstrap/Navbar'
import { Link } from 'react-router-dom'
import { useLocation } from 'react-router-dom'
import Button from 'react-bootstrap/Button'
import { useNavigate } from 'react-router-dom'
import { getToken, hasToken } from './authHelpers'

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

  return (
    <>
      <Navbar bg="dark" variant="dark" expand="lg">
        <Container>
          <Navbar.Brand as={Link} to="/schedule">
            Flight-Hub
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link
                className={hasToken() ? '' : 'd-none'}
                as={Link}
                to="/aircrafts"
              >
                Aircrafts
              </Nav.Link>
              <Nav.Link
                className={hasToken() ? '' : 'd-none'}
                as={Link}
                to="/profile"
              >
                Profile
              </Nav.Link>

              {!hasToken() ? (
                <>
                  <Nav.Link as={Link} to="/signup">
                    Signup
                  </Nav.Link>

                  <Nav.Link as={Link} to="/login">
                    Login
                  </Nav.Link>
                </>
              ) : null}

              <Button
                className={hasToken() ? '' : 'd-none'}
                variant="success"
                onClick={() => LogOut()}
              >
                Log Out
              </Button>
              <Navbar.Text className={hasToken() ? '' : 'd-none'}>
                {hasToken() ? getToken().userName : 'd-none'}
              </Navbar.Text>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  )
}

export default NavBar
