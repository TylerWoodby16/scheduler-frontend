import React from 'react'
import './App.css'
import { useState, useEffect } from 'react'
import { authGet } from './authHelpers'
import './AircraftDetails.css'
import { useParams } from 'react-router-dom'
import { Aircraft } from './models/Aircraft'
import Table from 'react-bootstrap/Table'
import ProgressBar from 'react-bootstrap/ProgressBar'
import { mockComponent } from 'react-dom/test-utils'
import { DateTime } from 'luxon'

const AircraftDetails: React.FC = () => {
  let { id } = useParams()
  const [aircraft, setAircraft] = useState<Aircraft>()

  // TODO: THIS IS TEMPORARY
  let date = DateTime.local()

  //this needs to be user input
  let checkDate = DateTime.local().minus({ months: 1 })
  let frontEndCheckDate = DateTime.local()
    .minus({ months: 1 })
    .toLocaleString(DateTime.DATETIME_FULL)
  let annualCheckDate = DateTime.local().plus({ months: 12 })
  let frontEndAnnualCheckDate = DateTime.local()
    .plus({ months: 12 })
    .toLocaleString(DateTime.DATETIME_FULL)

  let diffInDaysFromCurrentDate = annualCheckDate.diff(date, 'days')

  let diffInDaysFromCheckDate = annualCheckDate.diff(checkDate, 'days')

  let numberTypeOfDiffInDaysFromCurrentDate = diffInDaysFromCurrentDate.days

  let numberTypeOfDiffInDaysFromCheckDate = diffInDaysFromCheckDate.days

  let progressBarNumber =
    (numberTypeOfDiffInDaysFromCurrentDate /
      numberTypeOfDiffInDaysFromCheckDate) *
    100

  const progressBarColor = () => {
    let nameForProgressBar = ''
    if (progressBarNumber > 50) {
      nameForProgressBar = '#14A44D'
    }
    if (progressBarNumber < 10) {
      nameForProgressBar = '#DC4C64'
    } else {
      nameForProgressBar = '#E4A11B'
    }
    return nameForProgressBar
  }

  const getAircrafts = async () => {
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
    getAircrafts()
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
          <td>{frontEndCheckDate}</td>
          <td>{frontEndAnnualCheckDate}</td>
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
