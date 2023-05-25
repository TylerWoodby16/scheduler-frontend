import React from 'react'
import './Profile.css'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import { authGet } from '../authHelpers'
import { User } from '../models/User'
import { useState, useEffect } from 'react'
import { getToken } from '../authHelpers'
import Image from 'react-bootstrap/Image'
import { Button } from 'react-bootstrap'
import EmergencyContact from './EmergencyContact'
import logo from '../images/ahlogo.png'
import PhotoIdentification from './PhotoIdentification'
import CommercialLicenseComp from './CommercialLicesneComp'
import MedicalCertificateComp from './MedicalCertificateComp'
import FlightInstructorCertComp from './FlightInstructorCertComp'
import TSACitizenComp from './TSACitizenComp'
import TSASecurityComp from './TSASecurityComp'
import Currency141Comp from './Currency141Comp'
import PilotEndorsementsComp from './PilotEndorsementsComp'
import AircraftCheckOutComp from './AircraftCheckOutComp'

const Profile: React.FC = () => {
  const [user, setUser] = useState<User>()
  const [view, setView] = useState('Emergency')
  const [userLoaded, setUserLoaded] = useState(false)

  const getUser = async () => {
    try {
      const data = await authGet<User>(
        `http://localhost:5555/users/${getToken().userId}`
      )
      setUser(data)
      setUserLoaded(true)
    } catch (error: any) {
      //setResponseError('There was an error getting aircrafts.')
    }
  }

  useEffect(() => {
    getUser()
  }, [])

  return (
    <>
      <Container>
        <Row>
          <Col lg={4}>
            <Image
              className="pt-3"
              fluid
              roundedCircle
              src={logo}
              height="100"
              width="100"
            />
          </Col>
          <Col className="text-center text-white" lg={4}>
            <Row>
              <Col>
                <h1>
                  {user?.firstName} {user?.lastName}
                </h1>
              </Col>
            </Row>
            <Row>
              <span className="text-white">{user?.email}</span>
            </Row>
          </Col>
          <Col className="text-end">
            <Image fluid roundedCircle src={logo} height="100" width="100" />
          </Col>
        </Row>

        <Row className="pt-5">
          <Col className="text-white" lg={2}>
            <Row
              onClick={() => setView('Emergency')}
              className={view == 'Emergency' ? 'indicator tab p-2' : 'tab p-2'}
            >
              Emergency Contact
            </Row>
            <Row
              onClick={() => setView('Photo')}
              className={view == 'Photo' ? 'indicator tab p-2' : 'tab p-2'}
            >
              Photo Identification
            </Row>
            <Row
              onClick={() => setView('Commercial')}
              className={view == 'Commercial' ? 'indicator tab p-2' : 'tab p-2'}
            >
              Commercial License
            </Row>
            <Row
              onClick={() => setView('Medical')}
              className={view == 'Medical' ? 'indicator tab p-2' : 'tab p-2'}
            >
              Medical Certificate
            </Row>
            <Row
              onClick={() => setView('Flight')}
              className={view == 'Flight' ? 'indicator tab p-2' : 'tab p-2'}
            >
              Flight Instructor Certificate
            </Row>
            <Row
              onClick={() => setView('TSAC')}
              className={view == 'TSAC' ? 'indicator tab p-2' : 'tab p-2'}
            >
              TSA Citizenship
            </Row>
            <Row
              onClick={() => setView('TSAS')}
              className={view == 'TSAS' ? 'indicator tab p-2' : 'tab p-2'}
            >
              TSA Security Training
            </Row>
            <Row
              onClick={() => setView('141')}
              className={view == '141' ? 'indicator tab p-2' : 'tab p-2'}
            >
              Part 141 Currency
            </Row>
            <Row
              onClick={() => setView('Endorsements')}
              className={
                view == 'Endorsements' ? 'indicator tab p-2' : 'tab p-2'
              }
            >
              Pilot Endorsements
            </Row>
            <Row
              onClick={() => setView('Aircraft')}
              className={view == 'Aircraft' ? 'indicator tab p-2' : 'tab p-2'}
            >
              Aircraft Checkout
            </Row>
          </Col>
          <Col className="profile-background pt-4">
            <div>
              <Row className={view === 'Emergency' ? '' : 'd-none'}>
                <EmergencyContact user={user} />
              </Row>
              <Row className={view === 'Photo' ? '' : 'd-none'}>
                {userLoaded ? <PhotoIdentification user={user} /> : null}
                <Row>ID number</Row>
                <Row>Experation Date</Row>
                <Row>IMAGE OF FRONT S3?????</Row>
                <Row>IMAGE OF BACK S3?????</Row>
              </Row>
              <Row className={view === 'Commercial' ? '' : 'd-none'}>
                {userLoaded ? <CommercialLicenseComp user={user} /> : null}
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
              <Row className={view === 'Medical' ? '' : 'd-none'}>
                {userLoaded ? <MedicalCertificateComp user={user} /> : null}
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
              <Row className={view === 'Flight' ? '' : 'd-none'}>
                {userLoaded ? <FlightInstructorCertComp user={user} /> : null}
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
              <Row className={view === 'TSAC' ? '' : 'd-none'}>
                TSA Citizenship
                {userLoaded ? <TSACitizenComp user={user} /> : null}
                <Row>Type: Passport</Row>
                <Row>Uploaded File s3 </Row>
                <Button>Update</Button>
              </Row>
              <Row className={view === 'TSAS' ? '' : 'd-none'}>
                {userLoaded ? <TSASecurityComp user={user} /> : null}
                <Row>Date</Row>
                <Row>Expiration</Row>
                <Row>Employee ID</Row>
                <Row>Trainer</Row>
                <Button>Update</Button>
              </Row>
              <Row className={view === '141' ? '' : 'd-none'}>
                {userLoaded ? <Currency141Comp user={user} /> : null}
                <Row>Expirtion date</Row>
                <Row>Image of thing s3</Row>
                <Button>Update</Button>
              </Row>
              <Row className={view === 'Endorsements' ? '' : 'd-none'}>
                <Row>Endorsements</Row>
                {userLoaded ? <PilotEndorsementsComp user={user} /> : null}
                <Row>Date Given</Row>
                <Button>Update</Button>
              </Row>
              <Row className={view === 'Aircraft' ? '' : 'd-none'}>
                <Row>Aircraft Make and Model</Row>
                {userLoaded ? <AircraftCheckOutComp user={user} /> : null}
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
