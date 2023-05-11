import React from 'react'
import './Profile.css'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import { authGet } from '../authHelpers'
import { User } from '../models/User'
import { useState, useEffect } from 'react'
import { getToken, hasToken } from '../authHelpers'
import Image from 'react-bootstrap/Image'
import { Button } from 'react-bootstrap'
import ProfileModal from './ProfileModal'
import EmergencyContact from './EmergencyContact'

const Profile: React.FC = () => {
  const [user, setUser] = useState<User>({
    _id: '',
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    groupId: '',
    emergencyContact: '',
    photoId: '',
    commercialLicense: '',
    medicalCertificate: '',
    flightInstructorCertificate: '',
    tsaCitizenship: '',
    tsaSecurity: '',
    currency141: '',
    endorsements: '',
    aircraftCheckout: '',
  })
  const [view, setView] = useState('Emergency')

  // this is setting up state to show and hide the AD form
  const [showADForm, setShowADForm] = useState(false)

  // this is setting up state to show and hide the modal
  const [showModal, setShowModal] = useState(false)

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
    <>
      <ProfileModal
        user={user}
        showModal={showModal}
        setShowModal={setShowModal}
        getUser={getUser}
      />

      <Container>
        <Row>
          <Col>
            <Image
              fluid
              roundedCircle
              src={'logo.svg'}
              height="100"
              width="100"
            />
            <Row className="text-white">----------------------</Row>
          </Col>
          <Col className="text-center text-white">
            <Row>
              <h1>
                {user?.firstName} {user?.lastName}
              </h1>
            </Row>
            <Row>
              <span className="text-white">{user?.email}</span>
            </Row>
          </Col>
          <Col>
            <Button>Update</Button>
          </Col>
        </Row>

        <Row>
          <Col className="text-white" lg={2}>
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
              <Row className={view == 'Emergency' ? '' : 'd-none'}>
                <EmergencyContact user={user} />
              </Row>
              <Row className={view == 'Photo' ? '' : 'd-none'}>
                <Row>ID number</Row>
                <Row>Experation Date</Row>
                <Row>IMAGE OF FRONT S3?????</Row>
                <Row>IMAGE OF BACK S3?????</Row>
                <Button>Update</Button>
              </Row>
              <Row className={view == 'Commercial' ? '' : 'd-none'}>
                <Row>Certificate Type</Row>
                <Row>Certification Number</Row>
                <Row>Issued On</Row>
                <Row>No longer current date</Row>
                <Row>Category / Class</Row>
                <Row>Ratings / Endorsements</Row>
                <Row>Restrictions / Limitations</Row>
                <Row>IMAGE OF FRONT S3?????</Row>
                <Row>IMAGE OF BACK S3?????</Row>
                <Button>Update</Button>
              </Row>
              <Row className={view == 'Medical' ? '' : 'd-none'}>
                <Row>Class / BasicMed</Row>
                <Row>Certification Number</Row>
                <Row>Date of Birth</Row>
                <Row>Exam Date</Row>
                <Row>1st Class Expiration Date</Row>
                <Row>2nd Class Expiration Date</Row>
                <Row>3rd Class Expiration Date</Row>
                <Row>Restriction / Limitations</Row>
                <Row>IMAGE OF FRONT S3?????</Row>
                <Row>IMAGE OF BACK S3?????</Row>
                <Button>Update</Button>
              </Row>
              <Row className={view == 'Flight' ? '' : 'd-none'}>
                <Row>Certification Number</Row>
                <Row>Issued On</Row>
                <Row>Expires</Row>
                <Row>Category / Class</Row>
                <Row>Ratings / Endorsements</Row>
                <Row>Restrictions / Limitations</Row>
                <Row>IMAGE OF FRONT S3?????</Row>
                <Row>IMAGE OF BACK S3?????</Row>
                <Button>Update</Button>
              </Row>
              <Row className={view == 'TSAC' ? '' : 'd-none'}>
                TSA Citizenship
                <Row>Type: Passport</Row>
                <Row>Uploaded File s3 </Row>
                <Button>Update</Button>
              </Row>
              <Row className={view == 'TSAS' ? '' : 'd-none'}>
                <Row>Date</Row>
                <Row>Expiration</Row>
                <Row>Employee ID</Row>
                <Row>Trainer</Row>
                <Button>Update</Button>
              </Row>
              <Row className={view == '141' ? '' : 'd-none'}>
                <Row>Expirtion date</Row>
                <Row>Image of thing s3</Row>
                <Button>Update</Button>
              </Row>
              <Row className={view == 'Endorsements' ? '' : 'd-none'}>
                <Row>Endorsements</Row>
                <Row>Date Given</Row>
                <Button>Update</Button>
              </Row>
              <Row className={view == 'Aircraft' ? '' : 'd-none'}>
                <Row>Aircraft Make and Model</Row>
                <Button>Update</Button>
              </Row>
            </div>
          </Col>
        </Row>
      </Container>
    </>
  )
}

export default Profile
