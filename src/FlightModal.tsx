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
import {
  authPost,
  authGet,
  getToken,
  authDelete,
  authUpdate,
} from './authHelpers'
import { User } from './models/User'
import { DateTime } from 'luxon'

type Props = {
  aircraft?: Aircraft
  startTime?: number
  endTime?: number
  showModal: boolean
  setShowModal: Function
  getFlights: Function
  flight?: Flight
  date: string
}

const FlightModal: React.FC<Props> = ({
  aircraft,
  startTime,
  endTime,
  showModal,
  setShowModal,
  getFlights,
  flight,
  date,
}) => {
  const [errorCode, setErrorCode] = useState<number>()
  const [students, setStudents] = useState<User[]>()
  const [cfis, setCfis] = useState<User[]>()

  // TODO: INTEGRATE YUP INTO THE FORM
  const groupId = getToken().groupId

  const getUsers = async () => {
    try {
      // tell me why when i try to hit /users/studentUserId endpoint it gives me a 500 error when it is the same code ??
      const foundStudents = await authGet<User[]>(`http://localhost:5555/users`)
      // TODO: MAKE /users/students endpoint work correctly and call it here.
      // make state for setStudents()
      const foundCfis = await authGet<User[]>(
        `http://localhost:5555/users/cfis`
      )

      setStudents(foundStudents)
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
            {startTime}

            {'----' + endTime}
          </h1>

          <Formik
            enableReinitialize
            initialValues={
              {
                //Current Working theory is that it comes in with no ID so it is always just set by the backend
                // ?
                _id: flight ? flight._id : '',
                groupId: groupId,
                aircraftId: aircraft?._id,
                startTime: startTime,
                endTime: endTime,
                studentUserId: flight ? flight.studentUserId : '',
                instructorUserId: getToken().userId, //has a bug that if you sign in as not an instuctor it defaults to the first option
                date: date,
              } as Flight
            }
            onSubmit={async (
              values: Flight,
              { setSubmitting }: FormikHelpers<Flight>
            ) => {
              try {
                if (flight) {
                  await authUpdate(
                    `http://localhost:5555/flights/${flight._id}`,
                    values
                  )
                } else {
                  await authPost('http://localhost:5555/flights', values)
                }

                getFlights()
                setShowModal(false)
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
                          {/* This option is currently not used since we set the current user as instructor in initial values */}
                          {values.instructorUserId == '' ? (
                            <option value="" label="Select Instructor" />
                          ) : null}
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
                      <Form.Group
                        className="mb-3"
                        controlId="formStudentUserId"
                      >
                        <Form.Control
                          as="select"
                          name="studentUserId"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          value={values.studentUserId}
                        >
                          {values.studentUserId == '' ? (
                            <option value="" label="Select Student" />
                          ) : null}

                          {students
                            ? students.map((student, index) => {
                                return (
                                  <option
                                    value={student._id}
                                    label={
                                      student.firstName + ' ' + student.lastName
                                    }
                                    key={index}
                                  />
                                )
                              })
                            : null}
                        </Form.Control>
                      </Form.Group>
                    </Row>

                    <Row>
                      {flight ? (
                        <Button type="submit" variant="warning">
                          Update
                        </Button>
                      ) : (
                        <Button type="submit">Submit</Button>
                      )}
                    </Row>

                    <Row>
                      <Col>
                        <ResponseError statusCode={errorCode} />
                      </Col>
                    </Row>
                  </Col>
                </Container>
              </FormikForm>
            )}
          </Formik>
        </Modal.Body>
        <Modal.Footer>
          {flight && (
            <Button
              variant="danger"
              onClick={async () => {
                try {
                  await authDelete(
                    `http://localhost:5555/flights/${flight._id}`
                  )
                  getFlights()
                  setShowModal(false)
                } catch (err: any) {
                  setErrorCode(err.response.status)
                }
              }}
            >
              Delete
            </Button>
          )}
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
