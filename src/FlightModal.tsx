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
import DatePicker from 'react-datepicker'
import {
  authPost,
  authGet,
  getToken,
  authDelete,
  authUpdate,
} from './authHelpers'
import { User } from './models/User'
import { DateTime } from 'luxon'
import { number } from 'yup/lib/locale'
import { start } from 'repl'

type Props = {
  aircraft?: Aircraft
  startTime?: Date
  endTime?: Date
  showModal: boolean
  setShowModal: Function
  getFlights: Function
  flight?: Flight
  date: string
  times: Date[]
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
  times,
}) => {
  const [errorCode, setErrorCode] = useState<number>()
  const [students, setStudents] = useState<User[]>()
  const [cfis, setCfis] = useState<User[]>()
  const [typeOfFlight, setTypeOfFlight] = useState<string>('Dual')

  // this is for the type of flight bc Formiks onChange wouldnt let me set state
  const handleOnChange = (typeOfFlight: string) => {
    setTypeOfFlight(typeOfFlight)
  }

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
          <Formik
            enableReinitialize
            // For the form, we will use Unix epoch time because easier to deal with dropdowns that way.
            initialValues={{
              _id: flight ? flight._id : '',
              groupId: groupId,
              aircraftId: aircraft?._id,
              startTime: flight
                ? new Date(flight.startTime).getTime() // flight.startTime is actually a string, so must convert to Date
                : startTime?.getTime(),
              endTime: flight
                ? new Date(flight.endTime).getTime() // flight.endTime is actually a string, so must convert to Date
                : endTime?.getTime(),
              studentUserId: flight ? flight.studentUserId : '',
              instructorUserId: getToken().userId, //has a bug that if you sign in as not an instuctor it defaults to the first option
              date: date,
              typeOfFlight: typeOfFlight,
            }}
            onSubmit={async (values, { setSubmitting }: FormikHelpers<any>) => {
              try {
                // Force startTime and endTime into dates.
                // Also force them to be numbers because Formik was converting to string.
                values.startTime = new Date(Number(values.startTime))
                values.endTime = new Date(Number(values.endTime))

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
                  <Row>
                    <Col></Col>
                    <Col className="fw-bold fs-2">
                      {aircraft ? aircraft.name : null}
                    </Col>
                    <Col></Col>
                  </Row>
                  <Col className="mx-auto">
                    <Row lg={2} md={2} sm={2} xs={2}>
                      <Col>
                        <Form.Group className="mb-3" controlId="formEndtime">
                          <Form.Control
                            as="select"
                            name="typeOfFlight"
                            onChange={(e) =>
                              handleOnChange(e.currentTarget.value)
                            }
                            onBlur={handleBlur}
                            value={typeOfFlight}
                          >
                            <option value="Dual">Dual</option>
                            <option value="Solo">Solo</option>
                            <option value="EOC Stage Check">
                              EOC Stage Check
                            </option>
                            <option value="Discovery Flight">
                              Discovery Flight
                            </option>
                            <option value="Ground Training">
                              Ground Training
                            </option>
                            <option value="Maintenance">Maintenance</option>
                            <option value="MGA Buisness">MGA Business</option>
                            <option value="Pro Time">Pro Time</option>
                            <option value="Simulator">Simulator</option>
                            <option value="Student Solo">Student Solo</option>
                            <option value="Time Off">Time Off</option>
                          </Form.Control>
                        </Form.Group>
                      </Col>
                    </Row>
                    <Row>
                      <Col>Start Time</Col>
                      <Col>End Times</Col>
                    </Row>

                    {/* <Row lg={2} md={2} sm={2} xs={2}>
                      <Col>
                        <DatePicker
                          className="w-100 p-2 rounded mb-2"
                          selected={dateFromDatePicker2}
                          onChange={(date) => {
                            if (!date) return

                            setDateFromDatePicker2(date)

                            const parsedDate = DateTime.fromJSDate(date)

                            // const parsedDate = DateTime.fromISO(date)
                            const formattedDate =
                              parsedDate.toFormat('LLddyyyy')
                            // console.log(formattedDate)
                          }}
                        />
                      </Col>
                    </Row> */}

                    <Row lg={2} md={2} sm={2} xs={2}>
                      <Col>
                        <Form.Group className="mb-3" controlId="formStarttime">
                          <Form.Control
                            as="select"
                            name="startTime"
                            type="number"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.startTime}
                          >
                            {times.map((time, index) => {
                              return (
                                <option value={time.getTime()} key={index}>
                                  {time.getHours().toString() +
                                    ':' +
                                    time.getMinutes().toString()}
                                </option>
                              )
                            })}
                          </Form.Control>
                        </Form.Group>
                      </Col>
                      <Col>
                        <Form.Group className="mb-3" controlId="formEndtime">
                          <Form.Control
                            as="select"
                            name="endTime"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.endTime}
                          >
                            {/* basically i think that i need to bring in the lowestStartTime Variable and use that to cut off the time array (obvi making a new array ) */}
                            {times.map((time, index) => {
                              return (
                                <option value={time.getTime()} key={index}>
                                  {time.getHours().toString() +
                                    ':' +
                                    time.getMinutes().toString()}
                                </option>
                              )
                            })}
                          </Form.Control>
                        </Form.Group>
                      </Col>
                    </Row>
                    <Row>
                      <Col lg={2}>Instructor</Col>
                    </Row>
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
                      <Col lg={2}>Student</Col>
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

                    <Row></Row>

                    <Row>
                      <Col>
                        <ResponseError statusCode={errorCode} />
                      </Col>
                    </Row>
                  </Col>
                  {flight ? (
                    <Button type="submit" variant="warning">
                      Update
                    </Button>
                  ) : (
                    <Button type="submit">Submit</Button>
                  )}
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
                </Container>
              </FormikForm>
            )}
          </Formik>
        </Modal.Body>
        <Modal.Footer></Modal.Footer>
      </Modal>
    </>
  )
}

export default FlightModal
