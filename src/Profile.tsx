import React from 'react'
import './Profile.css'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import { authGet } from './authHelpers'
import './Home.css'
import { User } from './models/User'
import { useState, useEffect } from 'react'
import { getToken, hasToken } from './authHelpers'
import Image from 'react-bootstrap/Image'
import { Button } from 'react-bootstrap'

const Profile: React.FC = () => {
  const [user, setUser] = useState<User>()

  const getUser = async () => {
    try {
      const data = await authGet<User>(
        `http://localhost:5555/users/${getToken().userId}`
      )
      setUser(data)
    } catch (error: any) {
      //setResponseError('There was an error getting aircrafts.')
    }
  }

  useEffect(() => {
    getUser()
  }, [])

  return (
    <Container className="profile-background">
      <Row>
        <Col>
          <Image fluid roundedCircle src={'logo.svg'} width="100" />
        </Col>
        <Col>
          <Button>Update</Button>
        </Col>
      </Row>

      <Row>
        <Col className="text-center">
          <Row>
            <span className="text-white">
              {user?.firstName} {user?.lastName}
            </span>
          </Row>
          <Row>
            <span className="text-white">{user?.email}</span>
          </Row>
        </Col>
      </Row>
    </Container>
  )
}

export default Profile
