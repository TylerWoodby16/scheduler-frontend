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
  const [view, setView] = useState('')

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
    <Container>
      <Row>
        <Col>
          <Image fluid roundedCircle src={'logo.svg'} width="100" />
        </Col>
        <Col>
          <Button>Update</Button>
        </Col>
      </Row>

      <Row className="profile-background">
        <Col className="text-center">
          <Row>
            <h1>
              {user?.firstName} {user?.lastName}
            </h1>
          </Row>
          <Row>
            <span className="text-white">{user?.email}</span>
          </Row>
        </Col>
      </Row>
      <Row>
        <Col className="text-white">
          <Row onClick={() => setView('Emergency')} className="tab">
            Emergency Contact
          </Row>
          <Row onClick={() => setView('Photo')} className="tab">
            Photo ID
          </Row>
          <Row onClick={() => setView('Commercial')} className="tab">
            Commercial License
          </Row>
          <Row onClick={() => setView('Medical')} className="tab">
            Medical Certificate
          </Row>
          <Row onClick={() => setView('Flight')} className="tab">
            Flight Instructor Certificate
          </Row>
          <Row onClick={() => setView('TSAC')} className="tab">
            TSA Citizenship
          </Row>
          <Row onClick={() => setView('TSAS')} className="tab">
            TSA Security Training
          </Row>
          <Row onClick={() => setView('141')} className="tab">
            141 Currency
          </Row>
          <Row onClick={() => setView('Endorsements')} className="tab">
            Endorsements
          </Row>
          <Row onClick={() => setView('Aircraft')} className="tab">
            Aircraft Checkout
          </Row>
        </Col>
        <Col className="profile-background">
          <div>
            <Row className={view == 'Emergency' ? '' : 'd-none'}>emergency</Row>
            <Row className={view == 'Photo' ? '' : 'd-none'}>Photo ID Here</Row>
            <Row className={view == 'Commercial' ? '' : 'd-none'}>
              Commercial license here
            </Row>
            <Row className={view == 'Medical' ? '' : 'd-none'}>
              Medical License here
            </Row>
            <Row className={view == 'Flight' ? '' : 'd-none'}>
              Flight Instructor Cert
            </Row>
            <Row className={view == 'TSAC' ? '' : 'd-none'}>
              TSA Citizenship
            </Row>
            <Row className={view == 'TSAS' ? '' : 'd-none'}>
              TSA Security Training
            </Row>
            <Row className={view == '141' ? '' : 'd-none'}>141 Currency</Row>
            <Row className={view == 'Endorsements' ? '' : 'd-none'}>
              Endorsements
            </Row>
            <Row className={view == 'Aircraft' ? '' : 'd-none'}>
              Aircraft Checkout
            </Row>
          </div>
        </Col>
      </Row>
    </Container>
  )
}

export default Profile
