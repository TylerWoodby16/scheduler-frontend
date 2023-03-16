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
  })

  let annualCheckDate = DateTime.fromISO(aircraft.annualCheckDate)
  let nextAnnualCheckDate = annualCheckDate.plus({ months: 12 })

  let vorCheckDate = DateTime.fromISO(aircraft.vorCheckDate)
  console.log(vorCheckDate)
  let nextVorCheckDate = vorCheckDate.plus({ days: 30 })

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
          <td>0</td>
          <td>100</td>
        </tr>
        <tr>
          <td>Airworthiness Directives</td>
          <td>0</td>
          <td>5000</td>
        </tr>
        <tr>
          <td>Transponder</td>
          <td>2/1/23</td>
          <td>2/30/25</td>
        </tr>
        <tr>
          <td>ELT</td>
          <td>2/1/23</td>
          <td>2/30/23</td>
        </tr>
        <tr>
          <td>Static Encoder/ Altimeter</td>
          <td>2/1/23</td>
          <td>2/30/25</td>
        </tr>
      </tbody>
    </Table>
  )
}

export default AircraftDetails
