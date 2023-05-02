import React from 'react'
import './App.css'
import { useState, useEffect } from 'react'
import './AircraftDetails.css'
import { useParams, useLocation } from 'react-router-dom'
import { Aircraft, AirworthinessDirective } from './models/Aircraft'
import Table from 'react-bootstrap/Table'
import { DateTime } from 'luxon'
import { Button } from 'react-bootstrap'
import { Formik, Form as FormikForm, FormikHelpers } from 'formik'
import Form from 'react-bootstrap/Form'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import DatePicker from 'react-datepicker'
import { authGet, authPost, authUpdate } from './authHelpers'
import { Link } from 'react-router-dom'
import Modal from 'react-bootstrap/Modal'
import ResponseError from './ResponseError'
import AddAD from './AddAD'
import { group } from 'console'
import { format } from 'date-fns'

type Props = {
  aircraft: Aircraft
  showModal: boolean
  setShowModal: Function
  getAircraft: Function
}

const DetailsUpdateModal: React.FC<Props> = ({
  aircraft,
  showModal,
  setShowModal,
  getAircraft,
}) => {
  const [responseError, setResponseError] = useState<string>()

  const [annualCheckDate, setAnnualCheckDate] = useState<Date | null>(
    new Date(aircraft.annualCheckDate)
  )

  const [vorCheckDate, setVorCheckDate] = useState<Date | null>(new Date())

  const [eltCheckDate, setEltCheckDate] = useState<Date | null>(new Date())

  const [transponderCheckDate, setTransponderCheckDate] = useState<Date | null>(
    new Date()
  )

  const [altimeterCheckDate, setAltimeterCheckDate] = useState<Date | null>(
    new Date()
  )

  const updateAD = async (AD: AirworthinessDirective) => {
    // TODO: NEED TO HANDLE ERRORS.
    const statusCode = await authUpdate(
      `http://localhost:5555/aircrafts/updateAD/${aircraft._id}`,
      AD
    )
  }

  const updateAircraft = async (aircraft: Aircraft) => {
    // TODO: NEED TO HANDLE ERRORS.
    const statusCode = await authUpdate(
      `http://localhost:5555/aircrafts/${aircraft._id}`,
      aircraft
    )
  }

  return (
    <Modal
      show={showModal}
      onHide={() => {
        setShowModal(false)
        setResponseError(undefined)
      }}
    >
      <Modal.Header />
      <Modal.Body>
        {/* Formik Form here  */}
        Would you like to update {aircraft.name}?
        <h1 style={{ textAlign: 'center' }}>Update Aircraft</h1>
        <Formik
          initialValues={
            {
              _id: aircraft._id,
              groupId: aircraft.groupId,
              name: aircraft.name,
              year: aircraft.year,
              annualCheckDate: aircraft.annualCheckDate,
              vorCheckDate: aircraft.vorCheckDate,
              oneHundredHourCheck: aircraft.oneHundredHourCheck,
              eltCheckDate: aircraft.eltCheckDate,
              transponderCheckDate: aircraft.transponderCheckDate,
              altimeterCheckDate: aircraft.altimeterCheckDate,
              airworthinessDirectives: aircraft.airworthinessDirectives,
            } as Aircraft
          }
          onSubmit={async (
            values: Aircraft,
            { setSubmitting }: FormikHelpers<Aircraft>
          ) => {
            // WE DO NOT HANDLE ERRORS.
            // TODO: HANDLE ERRORS.

            // values.isHour = isHour

            // if (dateOfCheck && dateOfNextCheck) {
            //   values.dateOfCheck = dateOfCheck.toISOString()
            //   values.dateOfNextCheck = dateOfNextCheck.toISOString()
            // }

            // WAY ONE
            // await updateAD(values)

            // 1. use aircraft associated with this page for initial values
            // 2. pull out CURRENT ADs (possibly no ADs) -> aircraft.airworthinessdire gives us an array
            // 3. append the NEW AD to the end of the list
            // 4. put the list of ADs back into the aircraft and update

            // if (aircraft.airworthinessDirectives == null) {
            //   aircraft.airworthinessDirectives = []
            // }

            // aircraft.airworthinessDirectives.push(values)
            values.annualCheckDate = annualCheckDate!.toISOString()

            await updateAircraft(values)

            // Clean up page after updating.
            await getAircraft()
            setSubmitting(false)
            setShowModal(false)
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
                  </Row>

                  <Row className="mb-1">
                    <Form.Group className="mb-3" controlId="formYear">
                      <Form.Label className="text-light">Year</Form.Label>
                      <Form.Control
                        name="year"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.year}
                        type="year"
                        placeholder="Enter the year"
                      />
                      {errors.year && touched.year ? (
                        <div className="text-danger">
                          <small>{errors.year}</small>
                        </div>
                      ) : null}
                    </Form.Group>
                  </Row>

                  <Row className="mb-1">
                    <Form.Group className="mb-3" controlId="formYear">
                      <Form.Label className="text-light">
                        Annual Check Date
                      </Form.Label>
                      <DatePicker
                        className="w-100 p-2 rounded mb-2"
                        selected={annualCheckDate}
                        onChange={(date) => setAnnualCheckDate(date)}
                      />
                    </Form.Group>
                  </Row>

                  <Row className="mb-1">
                    <Form.Group className="mb-3" controlId="formYear">
                      <Form.Label className="text-light">
                        VOR Check Date
                      </Form.Label>
                      <DatePicker
                        className="w-100 p-2 rounded mb-2"
                        selected={vorCheckDate}
                        onChange={(date) => setVorCheckDate(date)}
                      />
                    </Form.Group>
                  </Row>

                  <Row className="mb-1">
                    <Form.Group className="mb-3" controlId="formYear">
                      <Form.Label className="text-light">100 Hour</Form.Label>
                      <Form.Control
                        name="oneHundredHourCheck"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.oneHundredHourCheck}
                        type="number"
                        placeholder="Enter the Hobbs time"
                      />
                      {errors.year && touched.year ? (
                        <div className="text-danger">
                          <small>{errors.year}</small>
                        </div>
                      ) : null}
                    </Form.Group>
                  </Row>

                  <Row className="mb-1">
                    <Form.Group className="mb-3" controlId="formYear">
                      <Form.Label className="text-light">ELT</Form.Label>
                      <DatePicker
                        className="w-100 p-2 rounded mb-2"
                        selected={eltCheckDate}
                        onChange={(date) => setEltCheckDate(date)}
                      />
                    </Form.Group>
                  </Row>

                  <Row className="mb-1">
                    <Form.Group className="mb-3" controlId="formYear">
                      <Form.Label className="text-light">
                        Transponder
                      </Form.Label>
                      <DatePicker
                        className="w-100 p-2 rounded mb-2"
                        selected={transponderCheckDate}
                        onChange={(date) => setTransponderCheckDate(date)}
                      />
                    </Form.Group>
                  </Row>

                  <Row className="mb-1">
                    <Form.Group className="mb-3" controlId="formYear">
                      <Form.Label className="text-light">Altimeter</Form.Label>
                      <DatePicker
                        className="w-100 p-2 rounded mb-2"
                        selected={altimeterCheckDate}
                        onChange={(date) => setAltimeterCheckDate(date)}
                      />
                    </Form.Group>
                  </Row>

                  <h2 style={{ textAlign: 'center' }}>
                    Airworthiness Directives
                  </h2>

                  {aircraft.airworthinessDirectives &&
                  values.airworthinessDirectives
                    ? aircraft.airworthinessDirectives.map((ad, index) => (
                        <div>
                          <Row>
                            <Col>{ad.name}</Col>
                          </Row>
                          {/* <Row>
                            <Col>
                              {ad.isHour ? (
                                <Row className="mb-1">
                                  <Form.Group
                                    className="mb-3"
                                    controlId="formAirworthinessDirectives"
                                  >
                                    <Form.Label className="text-light">
                                      airworthinessDirectives
                                    </Form.Label>
                                    <Form.Control
                                      name="airworthinessDirectives"
                                      onChange={handleChange}
                                      onBlur={handleBlur}
                                      value={
                                        values.airworthinessDirectives![index]
                                          .hourCheck
                                      }
                                      type="number"
                                      placeholder="Enter the year"
                                    />
                                    {errors.year && touched.year ? (
                                      <div className="text-danger">
                                        <small>{errors.year}</small>
                                      </div>
                                    ) : null}
                                  </Form.Group>
                                </Row>
                              ) : (
                                ad.dateOfCheck
                              )}
                            </Col>
                            <Col>{ad.dateOfNextCheck}</Col>
                          </Row> */}
                        </div>
                      ))
                    : null}

                  <Row>
                    <Button type="submit">Submit</Button>
                  </Row>

                  <ResponseError responseError={responseError} />
                </Col>
              </Container>
            </FormikForm>
          )}
        </Formik>
        <ResponseError responseError={responseError} />
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="secondary"
          onClick={() => {
            setShowModal(false)
            setResponseError(undefined)
          }}
        >
          Cancel
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export default DetailsUpdateModal
