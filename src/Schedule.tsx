import React from 'react'
import { useState, useEffect } from 'react'
import { Aircraft } from './models/Aircraft'
import { authGet } from './authHelpers'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import './Schedule.css'
import DatePicker from 'react-datepicker'
import { Container } from 'react-bootstrap'

import FlightModal from './FlightModal'
// import { string } from 'yup'

const Schedule: React.FC = () => {
  const [aircrafts, setAircrafts] = useState<Aircraft[]>([])
  const [responseError, setResponseError] = useState<string>()
  const [dateForSomething, setDateForSomething] = useState<Date | null>(
    new Date()
  )
  const [showModal, setShowModal] = useState<boolean>(false)

  const [selectedAircraft, setSelectedAircraft] = useState<Aircraft>()
  const [selectedTime, setSelectedTime] = useState<number>()

  // TODO: FIGURE OUT HOW TO JUST USE A FOR LOOP WHAT THE FUCK
  const times = [
    0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
    21, 22, 23,
  ]

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
                  {times.map((hour, index) => {
                    return <th key={index}>{hour}</th>
                  })}
                </tr>
                {aircrafts.map((aircraft, index) => {
                  return (
                    <tr>
                      <td key={index}>{aircraft.name}</td>
                      {times.map((hour, index) => {
                        return (
                          <>
                            <td
                              key={index}
                              onClick={() => {
                                setSelectedAircraft(aircraft)
                                setSelectedTime(hour)
                                setShowModal(true)
                              }}
                            ></td>
                          </>
                        )
                      })}
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </Col>
        </Row>
      </Container>

      <FlightModal
        aircraft={selectedAircraft}
        time={selectedTime}
        showModal={showModal}
        setShowModal={setShowModal}
      />
    </div>
  )
}

export default Schedule
