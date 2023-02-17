import React from 'react'
import './App.css'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import { authGet } from './authHelpers'
import './Home.css'
import Dropdown from 'react-bootstrap/Dropdown'
import Button from 'react-bootstrap/Button'

const Profile: React.FC = () => {
  return (
    <Container>
      <Row>
        <Col lg={5}>
          {/* <Image fluid roundedCircle src={momphoto} width="250" /> */}
        </Col>

        <Col>
          <Row>
            <Col className="mt-5">
              <Dropdown className="mb-3">
                <Dropdown.Toggle variant="info" id="dropdown-basic">
                  Account Settings
                </Dropdown.Toggle>

                <Dropdown.Menu>
                  <Dropdown.Item href="#/action-1">Action</Dropdown.Item>
                  <Dropdown.Item href="#/action-2">
                    Another action
                  </Dropdown.Item>
                  <Dropdown.Item href="#/action-3">
                    Something else
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </Col>
            <Col className="mt-5">
              <label>search</label>
              {/* <input type="text" onChange={(e) => setQuery(e.target.value)} /> */}
            </Col>
          </Row>
        </Col>
      </Row>

      <Row
        style={{
          backgroundColor: '#E0E0E0',
        }}
      >
        <Container>
          <Row>
            <Col className="text-center" lg={3} md={4} sm={6} xs={8}>
              {/* <p className="m-1">Name: {currentUser.name}</p> */}
              {/* <p className="m-1">Phone: {currentUser.phone}</p> */}
              {/* <p className="m-1">Username: {currentUser.email}</p> */}
              {/* <p className="m-1">Role: {currentUser.role}</p> */}
              {/* <p className="m-1">Active: {currentUser.active}</p> */}
              {/* <p className="m-1">Balance: {currentUser.balance}</p> */}
              {/* <p className="m-1">Last Flight: {currentUser.lastflight}</p> */}
              {/* <p className="m-1">Last Login: {currentUser.lastlogin}</p> */}
              {/* <p className="m-1">Created {currentUser.created}</p> */}
            </Col>

            <Col>
              {' '}
              <div className="d-grid gap-2">
                <Button
                  // onClick={() => documentClick()}
                  variant="secondary"
                  size="lg"
                >
                  Documents
                </Button>
              </div>{' '}
              <div className="d-grid gap-2">
                <Button
                  // onClick={() => endorsementsClick()}
                  variant="secondary"
                  size="lg"
                >
                  Endorsements
                </Button>
              </div>
              <div className="d-grid gap-2">
                <Button
                  // onClick={() => courseenrollmentClick()}
                  variant="secondary"
                  size="lg"
                >
                  Course Enrollments
                </Button>
              </div>{' '}
              <div className="d-grid gap-2">
                <Button
                  // onClick={() => notesClick()}
                  variant="secondary"
                  size="lg"
                >
                  Notes
                </Button>
              </div>
            </Col>
          </Row>
        </Container>
      </Row>

      <Container>
        <Row>
          <Col lg={6} md={6} sm={8} xs={10}>
            <Button variant="secondary" size="lg">
              Back
            </Button>
          </Col>
        </Row>

        <Row>
          <Col>DOCUMENTS DISPLAYED HERE</Col>
        </Row>
      </Container>

      <Container>
        <Row>
          <Col>
            <Button>Back</Button>
          </Col>
        </Row>

        <Row>
          <Col>ENDORSEMENTS DISPLAYED HERE</Col>
        </Row>
      </Container>
      <Container>
        <Row>
          <Col>
            <Button>Back</Button>
          </Col>
        </Row>

        <Row>
          <Col>Course Enrollments DISPLAYED HERE</Col>
        </Row>
      </Container>
      <Container>
        <Row>
          <Col>
            <Button variant="secondary" size="lg">
              Back
            </Button>
          </Col>
        </Row>

        <Row>
          <Col>Notes DISPLAYED HERE</Col>
        </Row>
      </Container>
    </Container>
  )
}

export default Profile
