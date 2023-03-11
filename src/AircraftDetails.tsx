import React from 'react'
import './App.css'
import { useState, useEffect } from 'react'
import { authGet } from './authHelpers'
import './AircraftDetails.css'
import { useParams, useLocation } from 'react-router-dom'
import { Aircraft } from './models/Aircraft'
import Table from 'react-bootstrap/Table'
import ProgressBar from 'react-bootstrap/ProgressBar'
import { DateTime } from 'luxon'

// TODO: pass the aircraft in as a prop.
// in the home component, we grab all aircrafts from the database.
// we should not re-query the database for this details page because we already have the aircraft.
// how can we pass an object as a parameter in react-router?
const AircraftDetails: React.FC = () => {
  let { id } = useParams()
  let { state } = useLocation()

  // Initialize aircraft to a dummy value.
  const [aircraft, setAircraft] = useState<Aircraft>({
    _id: '',
    name: '',
    groupId: '',
    year: -1,
    annualCheckDate: '',
  })

  // TODO: THIS IS TEMPORARY
  let date = DateTime.local()

  // 3/23/23 -> MM/DD/YY
  // let checkDate = DateTime.fromFormat(aircraft.annualCheckDate, 'MM/dd/yyyy')
  let checkDate = DateTime.fromISO(aircraft.annualCheckDate)

  let annualCheckDate = checkDate.plus({ months: 12 })

  let diffInDaysFromCurrentDate = annualCheckDate.diff(date, 'days')
  let diffInDaysFromCheckDate = annualCheckDate.diff(checkDate, 'days')
  let numberTypeOfDiffInDaysFromCurrentDate = diffInDaysFromCurrentDate.days
  let numberTypeOfDiffInDaysFromCheckDate = diffInDaysFromCheckDate.days

  let progressBarNumber =
    (numberTypeOfDiffInDaysFromCurrentDate /
      numberTypeOfDiffInDaysFromCheckDate) *
    100

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
          <th>Progress Bar</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Annual</td>
          <td>{checkDate.toLocaleString(DateTime.DATETIME_FULL)}</td>
          <td>{annualCheckDate.toLocaleString(DateTime.DATETIME_FULL)}</td>
          <td>
            <ProgressBar now={progressBarNumber} />
            {/* for progress bar go back to bootstrap react progressbar documentation to find the one where the length of the progress bar is dynamic. Then on Aircraft make a field for all the inspections, bring that number in. Use that number and the number of when it is due. And have the max lenth of the bar = to the difference between the dates of inspection and next due. Have the progress bar be equal to how much time is left from the current date to the next inspection.  */}
            {/* Also change color depending on how close it is bc all green is tough to look at  */}
          </td>
        </tr>
        <tr>
          <td>VOR</td>
          <td>2/1/23</td>
          <td>3/1/23</td>
          <td>
            <ProgressBar variant="success" now={60} />
            {/* for progress bar go back to bootstrap react progressbar documentation to find the one where the length of the progress bar is dynamic. Then on Aircraft make a field for all the inspections, bring that number in. Use that number and the number of when it is due. And have the max lenth of the bar = to the difference between the dates of inspection and next due. Have the progress bar be equal to how much time is left from the current date to the next inspection.  */}
          </td>
        </tr>
        <tr>
          <td>100 Hour</td>
          <td>0</td>
          <td>100</td>
          <td>
            <ProgressBar variant="success" now={60} />
            {/* for progress bar go back to bootstrap react progressbar documentation to find the one where the length of the progress bar is dynamic. Then on Aircraft make a field for all the inspections, bring that number in. Use that number and the number of when it is due. And have the max lenth of the bar = to the difference between the dates of inspection and next due. Have the progress bar be equal to how much time is left from the current date to the next inspection.  */}
          </td>
        </tr>
        <tr>
          <td>Airworthiness Directives</td>
          <td>0</td>
          <td>5000</td>
          <td>
            <ProgressBar variant="success" now={60} />
            {/* for progress bar go back to bootstrap react progressbar documentation to find the one where the length of the progress bar is dynamic. Then on Aircraft make a field for all the inspections, bring that number in. Use that number and the number of when it is due. And have the max lenth of the bar = to the difference between the dates of inspection and next due. Have the progress bar be equal to how much time is left from the current date to the next inspection.  */}
          </td>
        </tr>
        <tr>
          <td>Transponder</td>
          <td>2/1/23</td>
          <td>2/30/25</td>
          <td>
            <ProgressBar variant="success" now={60} />
            {/* for progress bar go back to bootstrap react progressbar documentation to find the one where the length of the progress bar is dynamic. Then on Aircraft make a field for all the inspections, bring that number in. Use that number and the number of when it is due. And have the max lenth of the bar = to the difference between the dates of inspection and next due. Have the progress bar be equal to how much time is left from the current date to the next inspection.  */}
          </td>
        </tr>
        <tr>
          <td>ELT</td>
          <td>2/1/23</td>
          <td>2/30/23</td>
          <td>
            <ProgressBar variant="success" now={60} />
            {/* for progress bar go back to bootstrap react progressbar documentation to find the one where the length of the progress bar is dynamic. Then on Aircraft make a field for all the inspections, bring that number in. Use that number and the number of when it is due. And have the max lenth of the bar = to the difference between the dates of inspection and next due. Have the progress bar be equal to how much time is left from the current date to the next inspection.  */}
          </td>
        </tr>
        <tr>
          <td>Static Encoder/ Altimeter</td>
          <td>2/1/23</td>
          <td>2/30/25</td>
          {/* possible forumula for what ever entry date is plus 24 calender months */}
          <td>
            <ProgressBar variant="success" now={60} />
            {/* for progress bar go back to bootstrap react progressbar documentation to find the one where the length of the progress bar is dynamic. Then on Aircraft make a field for all the inspections, bring that number in. Use that number and the number of when it is due. And have the max lenth of the bar = to the difference between the dates of inspection and next due. Have the progress bar be equal to how much time is left from the current date to the next inspection.  */}
          </td>
        </tr>
      </tbody>
    </Table>
  )
}

export default AircraftDetails
