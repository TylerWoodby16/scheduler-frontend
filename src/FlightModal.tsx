import React from 'react'
import './AppointmentModal.css'
import { useState, useEffect } from 'react'
import './AircraftDetails.css'
import { Aircraft } from './models/Aircraft'
import { Flight } from './models/Flight'
import { Button } from 'react-bootstrap'
import { Formik, Form as FormikForm, FormikHelpers } from 'formik'
import Form from 'react-bootstrap/Form'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Modal from 'react-bootstrap/Modal'
import ResponseError from './ResponseError'
import { authPost, authGet } from './authHelpers'
import { User } from './models/User'

type Props = {
  aircraft: Aircraft | undefined
  time: number | undefined
  showModal: boolean
  setShowModal: Function
}

const AppointmentModal: React.FC<Props> = ({
  aircraft,
  time,
  showModal,
  setShowModal,
}) => {
  const [errorCode, setErrorCode] = useState<number>()
  const [users, setUsers] = useState<User[]>()
  const [cfis, setCfis] = useState<User[]>()

  //TODO: INTEGRATE YUP INTO THE FORM

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
          <h1 style={{ textAlign: 'center' }}>{time}</h1>
          <Formik
            initialValues={
              {
                aircraftId: aircraft?._id,
                time: time,
                studentUserId: '',
              } as Flight
            }
            onSubmit={async (
              values: Flight,
              { setSubmitting }: FormikHelpers<Flight>
            ) => {
              try {
                setShowModal(false)
                insertFlight(values)
              } catch (error: any) {
                setErrorCode(error.response.status)
              }

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
            }) => (
              <FormikForm onSubmit={handleSubmit}>
                <Container>
                  <Col className="mx-auto">
                    <Row className="mb-1">
                      <Form.Group
                        className="mb-3"
                        controlId="formStudentUserId"
                      >
                        <Form.Label className="text-light">Name</Form.Label>

                        <select
                          name="studentUserId"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          value={values.studentUserId}
                          placeholder={'block'}
                        >
                          {/* TODO: getUsers then map through them and return the options */}

                          {users
                            ? users.map((user, index) => {
                                return (
                                  <option
                                    value={user._id}
                                    label={user.firstName + ' ' + user.lastName}
                                    key={index}
                                  ></option>
                                )
                              })
                            : null}
                        </select>
                        <select
                          name="studentUserId"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          value={values.studentUserId}
                          placeholder={'block'}
                        >
                          {/* TODO: getUsers then map through them and return the options */}

                          {users
                            ? users.map((user, index) => {
                                return (
                                  <option
                                    value={user._id}
                                    label={user.firstName + ' ' + user.lastName}
                                    key={index}
                                  ></option>
                                )
                              })
                            : null}
                        </select>
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

export default AppointmentModal
