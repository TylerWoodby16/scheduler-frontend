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

// TODO: pass the aircraft in as a prop.
// in the home component, we grab all aircrafts from the database.
// we should not re-query the database for this details page because we already have the aircraft.
// how can we pass an object as a parameter in react-router?
const AircraftDetails: React.FC = () => {
  const [responseError, setResponseError] = useState<string>()
  let { id } = useParams()
  let { state: aircraftFromRoute } = useLocation()
  // this is setting up state to show and hide the AD form
  const [showADForm, setShowADForm] = useState(false)
  // this is for showing the AD form
  const documentClick = () => {
    setShowADForm(true)
  }
  // this si for hiding the AD form
  const backClick = () => {
    setShowADForm(false)
  }

  // This is the piece of state for formik to select a date with date picker
  const [dateOfCheck, setDateOfCheck] = useState<Date | null>(new Date())

  const displayDate = (date: DateTime) => {
    return date.toLocaleString({
      month: '2-digit',
      day: '2-digit',
      year: '2-digit',
    })
  }

  const updateAD = async (AD: AirworthinessDirective) => {
    const statusCode = await authUpdate(
      `http://localhost:5555/aircrafts/updateAD/${aircraft._id}`,
      AD
    )
  }

  // Initialize aircraft to a dummy value.
  const [aircraft, setAircraft] = useState<Aircraft>({
    _id: '',
    name: '',
    groupId: '',
    year: -1,
    annualCheckDate: '',
    vorCheckDate: '',
    oneHundredHourCheck: 0,
    eltCheckDate: '',
    transponderCheckDate: '',
    altimeterCheckDate: '',
  })

  let annualCheckDate = DateTime.fromISO(aircraft.annualCheckDate)
  let nextAnnualCheckDate = annualCheckDate
    .startOf('month')
    .plus({ months: 13 })

  let vorCheckDate = DateTime.fromISO(aircraft.vorCheckDate)

  let nextVorCheckDate = vorCheckDate.plus({ days: 30 })

  let oneHundredHourCheck = aircraft.oneHundredHourCheck

  // must assign new AD structure this is the old one

  // let airworthinessDirectives = DateTime.fromISO(
  //   aircraft.airworthinessDirectives
  // )

  let eltCheckDate = DateTime.fromISO(aircraft.eltCheckDate)
  let nextEltCheckDate = eltCheckDate.startOf('month').plus({ months: 13 })

  let transponderCheckDate = DateTime.fromISO(aircraft.transponderCheckDate)
  let nextTransponderCheckDate = transponderCheckDate
    .startOf('month')
    .plus({ months: 25 })

  let altimeterCheckDate = DateTime.fromISO(aircraft.altimeterCheckDate)
  let nextAltimeterCheckDate = altimeterCheckDate
    .startOf('month')
    .plus({ months: 25 })

  const getAircraft = async () => {
    try {
      const aircraft = await authGet<Aircraft>(
        `http://localhost:5555/aircrafts/${id}`
      )
      setAircraft(aircraft)
    } catch (error: any) {
      // TODO: HANDLE ERROR CORRECTLY.
      console.log('error: ' + error)
    }
  }

  useEffect(() => {
    if (aircraftFromRoute == null) {
      getAircraft()
    } else {
      setAircraft(aircraftFromRoute)
    }
  }, [])

  return (
    <>
      <Button onClick={() => documentClick()}> Add AD </Button>
      <div className={showADForm ? '' : 'd-none'}>
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
            await updateAD(values)

            // 1. intitial values remain AD values // use aircraft associated with this page for initial values
            // 2. somehow destructure ADs // pull out CURRENT ADs (possibly no ADs) -> aircraft.airworthinessdire gives us an array
            // 3. append the NEW AD to the end of the list
            // 4. put the list of ADs back into the aircraft and update
            // ADsWithNewAD
            // aircraft.airworthinessDirectives = ADsWithNewAD
            // updateAircraft(aircraft)

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

                  <Row className="mb-1">
                    <Form.Group className="mb-3" controlId="formYear">
                      <Form.Label className="text-light">
                        Airworthiness Directive
                      </Form.Label>
                      <DatePicker
                        className="w-100 p-2 rounded mb-2"
                        selected={dateOfCheck}
                        onChange={(date) => setDateOfCheck(date)}
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
        <Button onClick={() => backClick()} variant="secondary" size="lg">
          Back
        </Button>
      </div>
      <Table striped bordered hover variant="dark">
        <thead>
          <tr>
            <td className="text-center" colSpan={12}>
              {aircraft ? aircraft.name : 'none'}
            </td>
          </tr>
          <tr>
            <th>Inspection</th>
            <th>Date of Inspection</th>
            <th>Date Inspection is Due</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Annual</td>
            <td>{displayDate(annualCheckDate)}</td>
            <td>{displayDate(nextAnnualCheckDate)}</td>
          </tr>
          <tr>
            <td>VOR</td>
            <td>{displayDate(vorCheckDate)}</td>
            <td>{displayDate(nextVorCheckDate)}</td>
          </tr>
          <tr>
            <td>100 Hour</td>
            <td>{oneHundredHourCheck}</td>
            <td>{oneHundredHourCheck + 100}</td>
          </tr>
          <tr>
            <td>Airworthiness Directives</td>
            <td>
              {/* {ADs.map((ad) => (
                <li>{ad}</li>
              ))} */}
            </td>
            <td>+5000</td>
          </tr>
          <tr>
            <td>Transponder</td>
            <td>{displayDate(transponderCheckDate)}</td>
            <td>{displayDate(nextTransponderCheckDate)}</td>
          </tr>
          <tr>
            <td>ELT</td>
            <td>{displayDate(eltCheckDate)}</td>
            <td>{displayDate(nextEltCheckDate)}</td>
          </tr>
          <tr>
            <td>Static Encoder/ Altimeter</td>
            <td>{displayDate(altimeterCheckDate)}</td>
            <td>{displayDate(nextAltimeterCheckDate)}</td>
          </tr>
        </tbody>
      </Table>
    </>
  )
}

export default AircraftDetails
