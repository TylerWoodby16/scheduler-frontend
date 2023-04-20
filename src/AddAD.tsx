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

type Props = {
  aircraft: Aircraft
  setShowADForm: Function
}

const AddAD: React.FC<Props> = ({ aircraft, setShowADForm }) => {
  const [responseError, setResponseError] = useState<string>()

  const [hourADBox, setHourADBox] = useState(false)

  const [isHour, setIsHour] = useState(false)

  // This is the piece of state for formik to select a date with date picker
  const [dateOfCheck, setDateOfCheck] = useState<Date | null>(new Date())

  const [dateOfNextCheck, setDateOfNextCheck] = useState<Date | null>(
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
    <>
      <h1 style={{ textAlign: 'center' }}>Airworthiness Directive</h1>
      <Formik
        initialValues={{
          name: '',
          dateOfCheck: '',
          dateOfNextCheck: '',
          hourCheck: 0,
          hourNextCheck: 0,
          isHour: true,
        }}
        onSubmit={async (
          values: AirworthinessDirective,
          { setSubmitting }: FormikHelpers<AirworthinessDirective>
        ) => {
          // WE DO NOT HANDLE ERRORS.
          // TODO: HANDLE ERRORS.

          values.isHour = isHour

          if (dateOfCheck && dateOfNextCheck) {
            values.dateOfCheck = dateOfCheck.toISOString()
            values.dateOfNextCheck = dateOfNextCheck.toISOString()
          }

          // WAY ONE
          // await updateAD(values)

          // 1. use aircraft associated with this page for initial values
          // 2. pull out CURRENT ADs (possibly no ADs) -> aircraft.airworthinessdire gives us an array
          // 3. append the NEW AD to the end of the list
          // 4. put the list of ADs back into the aircraft and update

          if (aircraft.airworthinessDirectives == null) {
            aircraft.airworthinessDirectives = []
          }

          aircraft.airworthinessDirectives.push(values)

          await updateAircraft(aircraft)

          // Clean up page after updating.
          setSubmitting(false)

          setShowADForm(false)
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
              <Col className="mx-auto" lg={4} md={6} sm={8} xs={10}>
                <Row className="mb-1">
                  <Form.Group className="mb-3" controlId="formADname">
                    <Form.Label>Name of AD </Form.Label>
                    <Form.Control
                      name="name"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values['name']}
                      type="string"
                      placeholder="Enter the name of this AD"
                    />
                  </Form.Group>
                </Row>

                <input
                  type="button"
                  value="Click me if your AD is based off of hours"
                  onClick={() => {
                    setHourADBox(true)
                    setIsHour(true)
                  }}
                ></input>
                <input
                  type="button"
                  value="Click me if your AD is based of the Date"
                  onClick={() => {
                    setHourADBox(false)
                    setIsHour(false)
                  }}
                ></input>

                <Row className={!hourADBox ? 'mb-1' : 'd-none'}>
                  <Form.Group className="mb-3" controlId="formYear">
                    <Form.Label className="text-light">
                      Date of Check
                    </Form.Label>
                    <DatePicker
                      className="w-100 p-2 rounded mb-2"
                      selected={dateOfCheck}
                      onChange={(date) => setDateOfCheck(date)}
                    />
                  </Form.Group>
                </Row>
                <Row className={!hourADBox ? 'mb-1' : 'd-none'}>
                  <Form.Group className="mb-3" controlId="formYear">
                    <Form.Label className="text-light">
                      Date of Next Check
                    </Form.Label>
                    <DatePicker
                      className="w-100 p-2 rounded mb-2"
                      selected={dateOfNextCheck}
                      onChange={(date) => setDateOfNextCheck(date)}
                    />
                  </Form.Group>
                </Row>
                <Row className={hourADBox ? 'mb-1' : 'd-none'}>
                  <Form.Group className="mb-3" controlId="formADhourCheck">
                    <Form.Label className="text-white">
                      Hour of AD check{' '}
                    </Form.Label>
                    <Form.Control
                      name="hourCheck"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values['hourCheck']}
                      type="number"
                      placeholder="Enter the hour of this AD check"
                    />
                  </Form.Group>
                </Row>
                <Row className={hourADBox ? 'mb-1' : 'd-none'}>
                  <Form.Group className="mb-3" controlId="formADhourNextCheck">
                    <Form.Label className="text-white">
                      Hour of next check{' '}
                    </Form.Label>
                    <Form.Control
                      name="hourNextCheck"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values['hourNextCheck']}
                      type="number"
                      placeholder="Enter the hour of this AD"
                    />
                  </Form.Group>
                </Row>

                {responseError ? (
                  <Row className="pb-3 text-center text-danger">
                    <Col>{responseError}</Col>
                  </Row>
                ) : null}

                <Row>
                  <Button type="submit">Submit</Button>
                </Row>
              </Col>
            </Container>
          </FormikForm>
        )}
      </Formik>
    </>
  )
}

export default AddAD
