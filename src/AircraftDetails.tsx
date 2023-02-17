import React from 'react'
import './App.css'
import { useState, useEffect } from 'react'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import { authGet } from './authHelpers'
import './Home.css'
import { useParams } from 'react-router-dom'
import { Aircraft } from './models/Aircraft'
import Table from 'react-bootstrap/Table'
import ProgressBar from 'react-bootstrap/ProgressBar'

const AircraftDetails: React.FC = () => {
  let { id } = useParams()
  const [aircraft, setAircraft] = useState<Aircraft>()

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
    <Container className="width: 20px mt-4">
      <Row className="g-4">{aircraft ? aircraft._id : 'none'}</Row>
      <Row className="g-4 mb-5">
        {' '}
        <Col></Col>
        <Col>{aircraft ? aircraft.name : 'none'}</Col>
        <Col></Col>
      </Row>

      <Table striped bordered hover variant="dark">
        <thead>
          <tr>
            <th>#</th>
            <th>Inspection</th>
            <th>Date of Inspections</th>
            <th>Progress Bar</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>1</td>
            <td>VOR Check</td>
            <td>2/1/23 next due 3/1/23</td>
            <td>
              <ProgressBar variant="success" now={60} />
              {/* for progress bar go back to bootstrap react progressbar documentation to find the one where the length of the progress bar is dynamic. Then on Aircraft make a field for all the inspections, bring that number in. Use that number and the number of when it is due. And have the max lenth of the bar = to the difference between the dates of inspection and next due. Have the progress bar be equal to how much time is left from the current date to the next inspection.  */}
            </td>
          </tr>
          <tr>
            <td>2</td>
            <td>Jacob</td>
            <td>Thornton</td>
            <td>@fat</td>
          </tr>
          <tr>
            <td>3</td>
            <td colSpan={2}>Larry the Bird</td>
            <td>@twitter</td>
          </tr>
        </tbody>
      </Table>
    </Container>
  )
}

export default AircraftDetails
