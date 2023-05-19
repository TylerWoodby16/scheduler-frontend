import React from 'react'
import './App.css'
import { useState, useEffect } from 'react'
import './AircraftDetails.css'
import { useParams } from 'react-router-dom'
import { Aircraft, AirworthinessDirective } from './models/Aircraft'
import Table from 'react-bootstrap/Table'
import { DateTime } from 'luxon'
import { Button } from 'react-bootstrap'
import Col from 'react-bootstrap/Col'
import { authGet, authPost, authUpdate } from './authHelpers'
import { Link } from 'react-router-dom'
import AddAD from './AddAD'
import DetailsUpdateModal from './DetailsUpdateModal'
// possibly already done due to the modal
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

  // this is setting up state to show and hide the modal
  const [showModal, setShowModal] = useState(false)

  const [aircraftLoaded, setAircraftLoaded] = useState(false)

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
    annualCheckDate: new Date().toISOString(),
    vorCheckDate: new Date().toISOString(),
    oneHundredHourCheck: 0,
    eltCheckDate: new Date().toISOString(),
    transponderCheckDate: new Date().toISOString(),
    altimeterCheckDate: new Date().toISOString(),
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
      setAircraftLoaded(true)
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
      {aircraftLoaded ? (
        <DetailsUpdateModal
          aircraft={aircraft}
          showModal={showModal}
          setShowModal={setShowModal}
          getAircraft={getAircraft}
        />
      ) : null}

      {/* these links will lead to a place where the owner of the website can upload the appropriate info for the planes */}
      <Col className="text-center">
        <span style={{ paddingRight: '10px' }}>
          <Link to={'/schedule'}> Performance Packet </Link>{' '}
        </span>
        <span style={{ paddingRight: '10px' }}>
          <Link to={'/schedule'}> Procedure Packet </Link>{' '}
        </span>
        <span style={{ paddingRight: '10px' }}>
          <Link to={'/schedule'}> Weight and Balance </Link>
        </span>
        <span style={{ paddingRight: '10px' }}>
          <Link to={'/schedule'}> CheckList </Link>
        </span>
      </Col>

      <Button onClick={() => setShowADForm(true)}> Add AD </Button>
      <Button
        onClick={async () => {
          setShowModal(true)
        }}
      >
        Update
      </Button>

      <div className={showADForm ? '' : 'd-none'}>
        <AddAD aircraft={aircraft} setShowADForm={setShowADForm} />
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
