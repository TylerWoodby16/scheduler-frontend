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
import { date } from 'yup/lib/locale'

// TODO: pass the aircraft in as a prop.
// in the home component, we grab all aircrafts from the database.
// we should not re-query the database for this details page because we already have the aircraft.
// how can we pass an object as a parameter in react-router?
const AircraftDetails: React.FC = () => {
  const [responseError, setResponseError] = useState<string>()
  let { id } = useParams()

  // let { state: aircraftFromRoute } = useLocation()
  // console.log(aircraftFromRoute.airworthinessDirectives)

  // this is setting up state to show and hide the AD form
  const [showADForm, setShowADForm] = useState(false)

  const [hourADBox, setHourADBox] = useState(false)

  const [isHour, setIsHour] = useState(false)

  // This is the piece of state for formik to select a date with date picker
  const [dateOfCheck, setDateOfCheck] = useState<Date | null>(new Date())

  const [dateOfNextCheck, setDateOfNextCheck] = useState<Date | null>(
    new Date()
  )

  const displayDate = (date: DateTime) => {
    return date.toLocaleString({
      month: '2-digit',
      day: '2-digit',
      year: '2-digit',
    })
  }

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
    getAircraft()
  }, [])

  return (
    <>
      {/* these links will lead to a place where the owner of the website can upload the appropriate info for the planes */}
      <Col className="text-center">
        <span style={{ paddingRight: '10px' }}>
          <Link to={'home'}> Performance Packet </Link>{' '}
        </span>
        <span style={{ paddingRight: '10px' }}>
          <Link to={'home'}> Procedure Packet </Link>{' '}
        </span>
        <span style={{ paddingRight: '10px' }}>
          <Link to={'home'}> Weight and Balance </Link>
        </span>
        <span style={{ paddingRight: '10px' }}>
          <Link to={'home'}> CheckList </Link>
        </span>
      </Col>

      <Button onClick={() => setShowADForm(true)}> Add AD </Button>
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
            await getAircraft()
            setShowADForm(false)
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
                    <Form.Group
                      className="mb-3"
                      controlId="formADhourNextCheck"
                    >
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
        <Button
          onClick={() => setShowADForm(false)}
          variant="secondary"
          size="lg"
        >
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
            <th>Date or Hour of Inspection</th>
            <th>Date or Hour Inspection is Due</th>
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
          <tr>
            <td>Airworthiness Directives</td>
          </tr>

          {aircraft.airworthinessDirectives
            ? aircraft.airworthinessDirectives.map((ad) => (
                <tr key={ad.name}>
                  <td>{ad.name}</td>
                  <td>{ad.isHour ? ad.hourCheck : ad.dateOfCheck}</td>
                  <td>{ad.isHour ? ad.hourNextCheck : ad.dateOfNextCheck}</td>
                </tr>
              ))
            : null}
        </tbody>
      </Table>
    </>
  )
}

export default AircraftDetails
