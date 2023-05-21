import React from 'react'
import { useState, useEffect } from 'react'
import { Aircraft } from './models/Aircraft'
import { authGet } from './authHelpers'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import './Schedule.css'
import DatePicker from 'react-datepicker'
import { Container } from 'react-bootstrap'

const Schedule: React.FC = () => {
  const [aircrafts, setAircrafts] = useState<Aircraft[]>([])
  const [responseError, setResponseError] = useState<string>()
  const [fillBox, setFillBox] = useState<boolean>(false)
  const [dateForSomething, setDateForSomething] = useState<Date | null>(
    new Date()
  )
  // how do i get the airplanes ???
  // should i pass them as a prop from airplanes?? instead what is the risk anal
  // how do i loop through the airplanes
  // how do i get that loop to produce the Y axis of my table
  const getAircrafts = async () => {
    try {
      const data = await authGet<Aircraft[]>('http://localhost:5555/aircrafts')
      setAircrafts(data)
    } catch (error: any) {
      setResponseError('There was an error getting aircrafts.')
    }
  }

  useEffect(() => {
    getAircrafts()
  }, [])

  return (
    <div>
      <div className="text-white text-center">SCHEDULE</div>
      <Row>
        <Col lg={2} className="text-center">
          <DatePicker
            className="w-100 p-2 rounded mb-2"
            selected={dateForSomething}
            onChange={(date) => setDateForSomething(date)}
          />
        </Col>
      </Row>
      <Container>
        <Row>
          <Col>
            <table className="table table-dark table-striped table-hover table-bordered">
              <thead></thead>
              <tbody>
                <tr>
                  <th>name</th>
                  <th>0:00</th>
                  <th>1:00</th>
                  <th>2:00</th>
                  <th>3:00</th>
                  <th>4:00</th>
                  <th>5:00</th>
                  <th>6:00</th>
                  <th>7:00</th>
                  <th>8:00</th>
                  <th>9:00</th>
                  <th>10:00</th>
                  <th>11:00</th>
                  <th>12:00</th>
                  <th>13:00</th>
                  <th>14:00</th>
                  <th>15:00</th>
                  <th>16:00</th>
                  <th>17:00</th>
                  <th>18:00</th>
                  <th>19:00</th>
                  <th>20:00</th>
                  <th>21:00</th>
                  <th>22:00</th>
                  <th>23:00</th>
                </tr>
                {aircrafts.map((aircraft, index) => {
                  return (
                    <tr>
                      <th>{aircraft.name}</th>
                      <th
                        className={fillBox ? 'box' : ''}
                        onClick={() => setFillBox(true)}
                      >
                        WHERE AM I
                      </th>
                      <th></th>
                      <th></th>
                      <th></th>
                      <th></th>
                      <th></th>
                      <th></th>
                      <th></th>
                      <th></th>
                      <th></th>
                      <th></th>
                      <th></th>
                      <th></th>
                      <th></th>
                      <th></th>
                      <th></th>
                      <th></th>
                      <th></th>
                      <th></th>
                      <th></th>
                      <th></th>
                      <th></th>
                      <th></th>
                      <th></th>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </Col>
        </Row>
      </Container>

      <table className="table table-dark table-striped table-hover">
        <thead>
          {/* tr th tr <- first airplane tr th tr <- second airplane  */}

          <tr>
            <th scope="col"></th>
            <th scope="col">First</th>
            <th scope="col">Last</th>
            <th scope="col">Handle</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th scope="row">1</th>
            <td>Mark</td>
            <td>Otto</td>
            <td>@mdo</td>
          </tr>
          <tr>
            <th scope="row">2</th>
            <td>Jacob</td>
            <td>Thornton</td>
            <td>@fat</td>
          </tr>
          <tr>
            <th scope="row">3</th>
            <td>Larry the Bird</td>
            <td>@twitter</td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}

export default Schedule
