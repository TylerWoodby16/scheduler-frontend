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
  // How do we get the appointment values ?? backend call ?? but isnt it null???
  // So we need to set the appointment here with the props given to us and the token
  // and a user get call for the student
  // const [appointment, setAppointment] = useState<{
  //   aircraft: Aircraft | undefined
  //   time: number | undefined
  // }>({
  //   aircraft: aircraft,
  //   time: time,
  // })

  const insertFlight = (flight: Flight) => {
    authPost('http://localhost:5555/flights', flight)
  }

  const getUsers = () => {
    authGet('http://localhost:5555/users')
  }

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
                    {/* <Row className="mb-1">
                      <Form.Group className="mb-3" controlId="formName">
                        <Form.Label className="text-light">Name</Form.Label>
                        <Form.Control
                          name="name"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          value={values.name}
                          type="name"
                          placeholder="Enter the planes name"
                        />
                        {errors.name && touched.name ? (
                          <div className="text-danger">
                            <small>{errors.name}</small>
                          </div>
                        ) : null}
                      </Form.Group>
                    </Row> */}

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
