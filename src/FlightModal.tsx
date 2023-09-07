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

  // Construction zone //////////////////////////////////////////////////////////////////////////////////////////////////////
  // need to put it in an if loop
  // aka a function

  // THIS IS TO MANIPULATE THE HOUR IN THE DATE
  const [dateOfStartTime, setDateOfStartTime] = useState<string>('')

  // const dateStart = startTime?.getDate().toString()
  // setDateOfStartTime(dateStart!)
  // dateForDatePicker2 instead of passing it down ??
  const [dateFromDatePicker2, setDateFromDatePicker2] = useState<Date>(
    new Date()
  )
  // console.log(startTime)
  // const dateObject = endTime
  // const hours = dateObject?.getHours()
  const [
    placeHolderStartTimeToBeShovedBackIntoFlight,
    setPlaceHolderStartTimeToBeShovedBackIntoFlight,
  ] = useState<number>(-1)

  // console.log(placeHolderStartTimeToBeShovedBackIntoFlight)

  // let originalString = startTime?.toString()
  // // console.log(originalString + 'This is the Original String')
  // // let searchString = ':'
  // // let editedPart = 'JavaScript'

  // // let modifiedString = originalString?.replace(searchString, editedPart)
  // // console.log(modifiedString) // "Hello JavaScript, world!"

  // let startIndex = 16 // Index of the time
  // let editedPart = (
  //   placeHolderStartTimeToBeShovedBackIntoFlight +
  //   ':' +
  //   startTime!.getMinutes()
  // ).toString()

  // let modifiedString =
  //   originalString?.slice(0, startIndex) +
  //   editedPart +
  //   originalString?.slice(startIndex + 1)

  // // console.log(modifiedString + 'Here is the Modified String')

  // let startIndexForDelete = 20 // Index of the comma
  // let endIndex = 24 // Index after the space

  // let modifiedString2 =
  //   modifiedString.substr(0, startIndexForDelete) +
  //   modifiedString.substr(endIndex)

  // console.log(modifiedString2 + 'this is the SECOND MS')

  const replaceHour = (flight: Flight) => {
    let originalString = startTime?.toString()
    // console.log(originalString + 'This is the Original String')
    // let searchString = ':'
    // let editedPart = 'JavaScript'

    // let modifiedString = originalString?.replace(searchString, editedPart)
    // console.log(modifiedString) // "Hello JavaScript, world!"

    let startIndex = 16 // Index of the time
    let editedPart = (
      placeHolderStartTimeToBeShovedBackIntoFlight +
      ':' +
      startTime!.getMinutes()
    ).toString()

    let modifiedString =
      originalString?.slice(0, startIndex) +
      editedPart +
      originalString?.slice(startIndex + 1)

    // console.log(modifiedString + 'Here is the Modified String')

    let startIndexForDelete = 20 // Index of the comma
    let endIndex = 24 // Index after the space

    let modifiedString2 =
      modifiedString.substr(0, startIndexForDelete) +
      modifiedString.substr(endIndex)
    return modifiedString2
  }

  // Construction zone //////////////////////////////////////////////////////////////////////////////////////////////////////

  // this is for the type of flight bc Formiks onChange wouldnt let me set state
  const handleOnChange = (typeOfFlight: string) => {
    setTypeOfFlight(typeOfFlight)
  }

  const handleOnChangeForHour = (
    placeHolderStartTimeToBeShovedBackIntoFlight: number
  ) => {
    setPlaceHolderStartTimeToBeShovedBackIntoFlight(
      placeHolderStartTimeToBeShovedBackIntoFlight
    )
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
            initialValues={
              {
                //Current Working theory is that it comes in with no ID so it is always just set by the backend
                // ?
                _id: flight ? flight._id : '',
                groupId: groupId,
                aircraftId: aircraft?._id,
                startTime: flight ? flight.startTime : startTime,
                endTime: flight ? flight.endTime : endTime,
                studentUserId: flight ? flight.studentUserId : '',
                instructorUserId: getToken().userId, //has a bug that if you sign in as not an instuctor it defaults to the first option
                date: date,
                typeOfFlight: typeOfFlight,
                dateOfStartTime: dateOfStartTime,
              } as Flight
            }
            onSubmit={async (
              values: Flight,
              { setSubmitting }: FormikHelpers<Flight>
            ) => {
              try {
                //TODO: Figure out why when you change the hour it turns to string
                // I could just do it in the backend lol
                // values.startTime = Number(values.startTime)
                // values.endTime = Number(values.endTime)

                // something like this
                // TODO: fix the ! LOL LOL
                values.startTime = new Date(replaceHour(flight!))
                // OK OK OK OK THIS ISNT WORKING AHHAHQAH
                console.log(values.startTime + ' I made it here ')
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
                    <Row lg={2} md={2} sm={2} xs={2}>
                      <Col>
                        {/* what is the value ??? */}
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
                    </Row>
                    <Row lg={2} md={2} sm={2} xs={2}>
                      <Col>
                        <Form.Group className="mb-3" controlId="formStarttime">
                          <Form.Control
                            as="select"
                            name="startTime"
                            onChange={(e) =>
                              handleOnChangeForHour(
                                new Date(e.currentTarget.value).getHours()
                              )
                            }
                            onBlur={handleBlur}
                            value={placeHolderStartTimeToBeShovedBackIntoFlight}
                          >
                            {times.map((time, index) => {
                              return (
                                <option value={time.toString()} key={index}>
                                  {time.toString()}
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
                            // value={values.endTime}
                          >
                            {/* cant be times lol this wont exist anymore */}

                            {/* {times.map((time, index) => {
                              return (
                                <option value={time} key={index}>
                                  {time}
                                </option>
                              )
                            })} */}

                            {/* I added Date to value here when you command click on value */}
                            {/* <option value={endTime}>
                              {endTime?.toString()}
                            </option> */}
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
