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
import { flightTypes } from './FlightTypes'
import {
  authPost,
  authGet,
  getToken,
  authDelete,
  authUpdate,
} from './authHelpers'
import { User } from './models/User'

type Props = {
  aircraft?: Aircraft
  aircrafts: Aircraft[]
  startTime?: Date
  possibleStartTimes: Date[]
  endTime?: Date
  showModal: boolean
  setShowModal: Function
  getFlights: Function
  flight?: Flight
  date: string
  times: Date[]
  // TODO: maybe need to pass refs using forwardRef?
  lowerBoundaryTime: React.MutableRefObject<Date>
  upperBoundaryTime: React.MutableRefObject<Date>
  setDefaultBoundaryTimes: Function
  settingUpperAndLowerBoundaryTimeNotInFlight: Function
  aircraftIdToFlights: Map<string, Flight[]>
}

const FlightModal: React.FC<Props> = ({
  aircraft,
  aircrafts,
  startTime,
  possibleStartTimes,
  endTime,
  showModal,
  setShowModal,
  getFlights,
  flight,
  date,
  times,
  lowerBoundaryTime,
  upperBoundaryTime,
  setDefaultBoundaryTimes,
  settingUpperAndLowerBoundaryTimeNotInFlight,
  aircraftIdToFlights,
}) => {
  const [errorCode, setErrorCode] = useState<number>()
  const [userError, setUserError] = useState<string>()
  const [students, setStudents] = useState<User[]>()
  const [cfis, setCfis] = useState<User[]>()
  // TODO: do i need this anymore ??
  const [flightType, setFlightType] = useState<string>('Dual')

  // this is for the type of flight bc Formiks onChange wouldnt let me set state
  // const handleOnChange = (typeOfFlight: string) => {
  //   setTypeOfFlight(typeOfFlight)
  // }

  // TODO: INTEGRATE YUP INTO THE FORM
  const groupId = getToken().groupId

  const getUsers = async () => {
    try {
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
  // turn this into a function and call it after I call settingUpperandLowerBOundary
  let permittedTimes = times.filter(
    (time: Date) =>
      time >= lowerBoundaryTime.current && time <= upperBoundaryTime.current
  )

  const updatePossibleEndTimes = () => {
    permittedTimes = times.filter(
      (time: Date) =>
        time >= lowerBoundaryTime.current && time <= upperBoundaryTime.current
    )
    return permittedTimes
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
          setDefaultBoundaryTimes()
          setErrorCode(undefined)
          setUserError(undefined)
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
              flightType: flight ? flight.flightType : flightType,
            }}
            onSubmit={async (values, { setSubmitting }: FormikHelpers<any>) => {
              try {
                if (values.endTime < values.startTime) {
                  setUserError('Flight cannot end before it starts.')
                  return
                }

                if (values.startTime == values.endTime) {
                  setUserError('Start time can not equal End time')
                  return
                }
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
                setDefaultBoundaryTimes()
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
                            name="flightType"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.flightType}
                          >
                            {flightTypes.map((flightType, index) => {
                              return (
                                <option value={flight?.flightType} key={index}>
                                  {flightType}
                                </option>
                              )
                            })}
                          </Form.Control>
                        </Form.Group>
                      </Col>
                    </Row>

                    <Row>
                      <Col>
                        <Form.Group className="mb-3" controlId="formStarttime">
                          <Form.Control
                            as="select"
                            name="aircraftId"
                            type="number"
                            onChange={(e) => {
                              handleChange(e)
                              const flightsForAircraft =
                                // wrong aircraft
                                aircraftIdToFlights.get(e.target.value)

                              // On value change, recgalculate possible end times.
                              // First need to update boundary times.
                              settingUpperAndLowerBoundaryTimeNotInFlight(
                                flightsForAircraft,
                                new Date(Number(e.target.value)),
                                lowerBoundaryTime,
                                upperBoundaryTime
                              )

                              updatePossibleEndTimes()
                            }}
                            onBlur={handleBlur}
                            value={values.aircraftId}
                          >
                            {aircrafts.map((aircraft, index) => {
                              return (
                                <option value={aircraft._id} key={index}>
                                  {aircraft.name}
                                </option>
                              )
                            })}
                          </Form.Control>
                        </Form.Group>
                      </Col>
                    </Row>

                    <Row>
                      <Col>Start Time</Col>
                      <Col>End Times</Col>
                    </Row>

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
                            {permittedTimes.map((time, index) => {
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
                      <Col>Possible Start Time</Col>
                      <Col>
                        <Form.Group className="mb-3" controlId="formStarttime">
                          <Form.Control
                            as="select"
                            name="startTime"
                            type="number"
                            onChange={(e) => {
                              handleChange(e)
                              const flightsForAircraft =
                                aircraftIdToFlights.get(aircraft!._id)

                              // On value change, recgalculate possible end times.
                              // First need to update boundary times.
                              settingUpperAndLowerBoundaryTimeNotInFlight(
                                flightsForAircraft,
                                new Date(Number(e.target.value)),
                                lowerBoundaryTime,
                                upperBoundaryTime
                              )

                              updatePossibleEndTimes()
                            }}
                            onBlur={handleBlur}
                            value={values.startTime}
                          >
                            {possibleStartTimes.map((time, index) => {
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
                      <Col>End Time</Col>
                      <Col>
                        <Form.Group className="mb-3" controlId="formEndtime">
                          <Form.Control
                            as="select"
                            name="endTime"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.endTime}
                          >
                            {updatePossibleEndTimes().map((time, index) => {
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
                        <ResponseError
                          statusCode={errorCode}
                          responseError={userError}
                        />
                      </Col>
                    </Row>
                  </Col>
                  <Col>
                    <Row>
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
                              setDefaultBoundaryTimes()
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
                          setDefaultBoundaryTimes()
                          setErrorCode(undefined)
                          setUserError(undefined)
                        }}
                      >
                        Cancel
                      </Button>
                    </Row>
                  </Col>
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
