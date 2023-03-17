import React from 'react'
import './App.css'
import { useState, useEffect } from 'react'
import { authGet } from './authHelpers'
import './AircraftDetails.css'
import { useParams, useLocation } from 'react-router-dom'
import { Aircraft } from './models/Aircraft'
import Table from 'react-bootstrap/Table'
import { DateTime } from 'luxon'

// TODO: pass the aircraft in as a prop.
// in the home component, we grab all aircrafts from the database.
// we should not re-query the database for this details page because we already have the aircraft.
// how can we pass an object as a parameter in react-router?
const AircraftDetails: React.FC = () => {
  let { id } = useParams()
  let { state } = useLocation()

  const displayDate = (date: DateTime) => {
    return date.toLocaleString({
      month: '2-digit',
      day: '2-digit',
      year: '2-digit',
    })
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
    airWorthinessDirectivesCheckDate: '',
    eltCheckDate: '',
    transponderCheckDate: '',
    altimeterCheckDate: '',
  })

  let annualCheckDate = DateTime.fromISO(aircraft.annualCheckDate)
  let nextAnnualCheckDate = annualCheckDate
    .startOf('month')
    .plus({ months: 13 })
  // what if this is 1 this wont work
  // let nextNextAnnualCheckDate = nextAnnualCheckDate.minus({
  //   days: parseInt(dayDate(annualCheckDate)),
  // })

  let vorCheckDate = DateTime.fromISO(aircraft.vorCheckDate)

  let nextVorCheckDate = vorCheckDate.plus({ days: 30 })

  let oneHundredHourCheck = aircraft.oneHundredHourCheck

  let airWorthinessDirectivesCheckDate = DateTime.fromISO(
    aircraft.airWorthinessDirectivesCheckDate
  )

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
      const data = await authGet<Aircraft>(
        `http://localhost:5555/aircrafts/${id}`
      )
      setAircraft(data)
    } catch (error: any) {
      console.log('error: ' + error)
    }
  }

  useEffect(() => {
    if (state == null) {
      getAircraft()
    } else {
      setAircraft(state)
    }
  }, [])

  return (
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
          <td>{displayDate(airWorthinessDirectivesCheckDate)}</td>
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
  )
}

export default AircraftDetails
