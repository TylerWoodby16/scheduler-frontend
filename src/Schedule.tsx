import React from 'react'
import { useState, useEffect } from 'react'
import { Aircraft } from './models/Aircraft'
import { Flight } from './models/Flight'
import { authGet } from './authHelpers'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import './Schedule.css'
import DatePicker from 'react-datepicker'
import { Container } from 'react-bootstrap'
import FlightModal from './FlightModal'

const Schedule: React.FC = () => {
  const [aircrafts, setAircrafts] = useState<Aircraft[]>([])
  const [responseError, setResponseError] = useState<string>()
  const [dateForSomething, setDateForSomething] = useState<Date | null>(
    new Date()
  )
  const [showModal, setShowModal] = useState<boolean>(false)

  const [selectedFlight, setSelectedFlight] = useState<Flight>()
  const [selectedAircraft, setSelectedAircraft] = useState<Aircraft>()
  const [selectedTime, setSelectedTime] = useState<number>()
  const [selectedEndTime, setSelectedEndTime] = useState<number>()

  const [scheduledFlights, setScheduledFlights] =
    useState<Map<string, Map<number, Flight>>>()

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

  // first attempt at trying to highlight the td when a flight is set
  const getFlights = async () => {
    try {
      const data = await authGet<Flight[]>('http://localhost:5555/flights')
      const scheduled = buildScheduledFlights(data)
      console.log(scheduled)
      setScheduledFlights(scheduled)
    } catch (error: any) {
      setResponseError('There was an error getting flights.')
    }
  }

  useEffect(() => {
    getAircrafts()
    getFlights()
  }, [])

  const buildScheduledFlights = (flights: Flight[]) => {
    const scheduledFlights = new Map<string, Map<number, Flight>>()

    flights.map((flight, index) => {
      let aircraftId = flight.aircraftId
      let startTime = flight.startTime

      if (scheduledFlights.has(aircraftId)) {
        const hourToScheduled = scheduledFlights.get(aircraftId)!
        hourToScheduled?.set(startTime, flight)
        scheduledFlights.set(aircraftId, hourToScheduled)
      } else {
        const hourToScheduled = new Map<number, Flight>()
        hourToScheduled.set(startTime, flight)
        scheduledFlights.set(aircraftId, hourToScheduled)
      }
    })
    return scheduledFlights
  }

  return (
    <div>
      <div className="text-white text-center">SCHEDULE</div>

      <Row>
        <Col></Col>
        <Col lg={2} className="text-center">
          <DatePicker
            className="w-100 p-2 rounded mb-2"
            selected={dateForSomething}
            onChange={(date) => setDateForSomething(date)}
          />
        </Col>
        <Col></Col>
      </Row>
      <Container>
        <Row>
          <Col>
            <table className="table table-dark  table-bordered">
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
                      <td key={index}>
                        {aircraft.name} {aircraft._id}
                      </td>
                      {times.map((hour, index) => {
                        return (
                          <>
                            <td
                              key={index}
                              className={
                                scheduledFlights?.get(aircraft._id)?.get(hour)
                                  ? 'scheduledFlightBox'
                                  : ''
                              }
                              onPointerDown={(e) => {
                                setSelectedTime(hour)
                              }}
                              onPointerMove={(e) => {
                                // console.log('onPointerMove')
                              }}
                              onPointerUp={(e) => {
                                const flight = scheduledFlights
                                  ?.get(aircraft._id)
                                  ?.get(hour)

                                if (flight) {
                                  setSelectedFlight(flight)
                                } else {
                                  setSelectedFlight(undefined)
                                }
                                setSelectedAircraft(aircraft)
                                setSelectedEndTime(hour)
                                setShowModal(true)
                              }}
                            >
                              1
                            </td>
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
        startTime={selectedTime}
        endTime={selectedEndTime}
        showModal={showModal}
        setShowModal={setShowModal}
        getFlights={getFlights}
        flight={selectedFlight}
      />
    </div>
  )
}

export default Schedule
