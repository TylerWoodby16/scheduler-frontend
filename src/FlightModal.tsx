import React from 'react'
import './AppointmentModal.css'
import { useState, useEffect } from 'react'
import './AircraftDetails.css'
import { Aircraft } from './models/Aircraft'
import { Flight } from './models/Flight'
import { Button, Dropdown } from 'react-bootstrap'
import { Formik, Field, Form as FormikForm, FormikHelpers } from 'formik'
import Form from 'react-bootstrap/Form'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Modal from 'react-bootstrap/Modal'
import ResponseError from './ResponseError'
import { authPost, authGet, getToken } from './authHelpers'
import { User } from './models/User'

type Props = {
  aircraft: Aircraft | undefined
  time: number | undefined
  endTime: number | undefined
  showModal: boolean
  setShowModal: Function
}

const FlightModal: React.FC<Props> = ({
  aircraft,
  time,
  endTime,
  showModal,
  setShowModal,
}) => {
  const [errorCode, setErrorCode] = useState<number>()
  const [users, setUsers] = useState<User[]>()
  const [cfis, setCfis] = useState<User[]>()

  //TODO: INTEGRATE YUP INTO THE FORM
  const groupId = getToken().groupId

  const insertFlight = (flight: Flight) => {
    authPost('http://localhost:5555/flights', flight)
  }

  const getUsers = async () => {
    try {
      // tell me why when i try to hit /users/studentUserId endpoint it gives me a 500 error when it is the same code ??
      const foundUsers = await authGet<User[]>(`http://localhost:5555/users`)
      const foundCfis = await authGet<User[]>(
        `http://localhost:5555/users/cfis`
      )

      setUsers(foundUsers)
      setCfis(foundCfis)
    } catch (error: any) {
      // TODO: HANDLE ERROR CORRECTLY.
      console.log('error: ' + error)
    }
  }

  useEffect(() => {
    getUsers()
  }, [])

  return (
    <>
      <Modal
        show={showModal}
        onHide={() => {
          setShowModal(false)
          setErrorCode(undefined)
        }}
      >
        <Modal.Header />
        <Modal.Body>
          {/* Formik Form here  */}

          {aircraft ? aircraft.name : null}
          <h1 style={{ textAlign: 'center' }}>
            {time}

            {'----' + endTime}
          </h1>

          <Formik
            enableReinitialize
            initialValues={
              {
                // to stop updating the group id in the be we need to set it as an initial value
                groupId: groupId,
                aircraftId: aircraft?._id,
                time: time,
                endTime: endTime,
                studentUserId: '',
                instructorUserId: '',
              } as Flight
            }
            onSubmit={async (
              values: Flight,
              { setSubmitting }: FormikHelpers<Flight>
            ) => {
              // try {
              //   console.log(values)
              //   setShowModal(false)
              //   insertFlight(values)
              // } catch (error: any) {
              //   setErrorCode(error.response.status)
              // }

              console.log('MODAL VALUES')
              console.log(values)

              setSubmitting(false)
            }}
          >
            {({
              values,
              errors,
              touched,
              handleChange,
              handleBlur,
              handleSubmit,
              isSubmitting,
              getFieldHelpers,
            }) => (
              <FormikForm onSubmit={handleSubmit}>
                <Container>
                  <Col className="mx-auto">
                    <Row>
                      <Form.Group
                        className="mb-3"
                        controlId="formInstructorUserId"
                      >
                        <Form.Control
                          as="select"
                          name="instructorUserId"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          value={values.instructorUserId}
                        >
                          {cfis
                            ? cfis.map((cfi, index) => {
                                return (
                                  <option
                                    value={cfi._id}
                                    label={cfi.firstName + ' ' + cfi.lastName}
                                    key={index}
                                  />
                                )
                              })
                            : null}
                        </Form.Control>
                      </Form.Group>
                    </Row>

                    <Row>
                      <Button type="submit">Submit</Button>
                    </Row>

                    <ResponseError statusCode={errorCode} />
                  </Col>
                </Container>
              </FormikForm>
            )}
          </Formik>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => {
              setShowModal(false)
              setErrorCode(undefined)
            }}
          >
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default FlightModal
