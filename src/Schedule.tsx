import React from 'react'
import { useState, useEffect } from 'react'
import { Aircraft } from './models/Aircraft'
import { Flight } from './models/Flight'
import { authGet } from './authHelpers'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import './Schedule.css'
import DatePicker from 'react-datepicker'
import { Container, Placeholder } from 'react-bootstrap'
import FlightModal from './FlightModal'
import { DateTime } from 'luxon'

const Schedule: React.FC = () => {
  const [aircrafts, setAircrafts] = useState<Aircraft[]>([])
  const [responseError, setResponseError] = useState<string>()

  // TODO: REFACTOR THIS
  const [dateFromDatePicker, setDateFromDatePicker] = useState<Date>(new Date())
  const [dateOfFlights, setDateOfFlights] = useState<string>(
    DateTime.fromJSDate(new Date()).toFormat('LLddyyyy')
  )

  const [showModal, setShowModal] = useState<boolean>(false)

  const [selectedFlight, setSelectedFlight] = useState<Flight>()

  const [selectedAircraft, setSelectedAircraft] = useState<Aircraft>()

  // Default to -1 before we have used setter.
  const [selectedStartTime, setSelectedStartTime] = useState<number>(-1)
  let [selectedEndTime, setSelectedEndTime] = useState<number>(-1)

  const [aircraftIdToFlights, setAircraftIdToFLights] = useState<
    Map<string, Flight[]>
  >(new Map<string, Flight[]>())

  // TODO: FIGURE OUT HOW TO JUST USE A FOR LOOP WHAT THE FUCK
  const times = [
    0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
    21, 22, 23, 24,
  ]

  const getAircrafts = async () => {
    try {
      const data = await authGet<Aircraft[]>('http://localhost:5555/aircrafts')
      setAircrafts(data)
    } catch (error: any) {
      setResponseError('There was an error getting aircrafts.')
    }
  }

  const getFlights = async () => {
    try {
      const data = await authGet<Flight[]>(
        `http://localhost:5555/flights/${dateOfFlights}`
      )

      setAircraftIdToFLights(buildAircraftIdToFlights(data))
      // console.log(aircraftIdToFlights)
    } catch (error: any) {
      setResponseError('There was an error getting flights.')
    }
  }

  useEffect(() => {
    getAircrafts()
    getFlights()
  }, [dateFromDatePicker])

  // const buildScheduledFlights = (flights: Flight[]) => {
  //   const scheduledFlights = new Map<string, Map<number, Flight>>()

  //   flights.map((flight, index) => {
  //     let aircraftId = flight.aircraftId
  //     let startTime = flight.startTime

  //     if (scheduledFlights.has(aircraftId)) {
  //       const hourToScheduled = scheduledFlights.get(aircraftId)!
  //       hourToScheduled?.set(startTime, flight)
  //       scheduledFlights.set(aircraftId, hourToScheduled)
  //     } else {
  //       const hourToScheduled = new Map<number, Flight>()
  //       hourToScheduled.set(startTime, flight)
  //       scheduledFlights.set(aircraftId, hourToScheduled)
  //     }
  //   })
  //   return scheduledFlights
  // }

  const buildAircraftIdToFlights = (flights: Flight[]) => {
    const aircraftIdToFlights = new Map<string, Flight[]>()

    flights.map((flight, index) => {
      let aircraftId = flight.aircraftId

      if (!aircraftIdToFlights.get(aircraftId)) {
        aircraftIdToFlights.set(aircraftId, [flight])
      } else {
        const flights = aircraftIdToFlights.get(aircraftId)
        if (flights) {
          flights?.push(flight)
          aircraftIdToFlights.set(aircraftId, flights)
        }
      }
    })

    return aircraftIdToFlights
  }

  // make a new piece of state called aircraftIdToFlights
  // create function taking list of flights and returning map of aircraft id -> list of flights for that aircraft

  const hourInRange = (flight: Flight, hour: number) => {
    return hour >= flight.startTime && hour <= flight.endTime
  }

  const highlightFlightBox = (
    flights: Flight[] | undefined,
    hour: number
  ): boolean => {
    if (!flights) return false

    let inRange = false
    flights.forEach((flight) => {
      if (hourInRange(flight, hour)) {
        inRange = true
      }
    })

    return inRange
  }

  return (
    <div>
      <div className="text-white text-center">SCHEDULE</div>

      <Row>
        <Col></Col>
        <Col lg={2} className="text-center">
          <DatePicker
            className="w-100 p-2 rounded mb-2"
            selected={dateFromDatePicker}
            onChange={(date) => {
              if (!date) return

              setDateFromDatePicker(date)

              const parsedDate = DateTime.fromJSDate(date)

              // const parsedDate = DateTime.fromISO(date)
              const formattedDate = parsedDate.toFormat('LLddyyyy')
              // console.log(formattedDate)

              // could be from the !

              // could be from the needed reFactor
              setDateOfFlights(formattedDate)
            }}
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
                    <tr key={index}>
                      <td key={index}>
                        {aircraft.name} {aircraft._id}
                      </td>
                      {times.map((hour, index) => {
                        return (
                          <>
                            <td
                              key={index}
                              className={
                                highlightFlightBox(
                                  aircraftIdToFlights?.get(aircraft._id),
                                  hour
                                )
                                  ? 'scheduledFlightBox'
                                  : ''
                              }
                              onPointerDown={(e) => {
                                setSelectedStartTime(hour)
                              }}
                              onPointerMove={(e) => {
                                // console.log(hour)
                                setSelectedEndTime(hour)
                              }}
                              onPointerUp={(e) => {
                                const flights = aircraftIdToFlights?.get(
                                  aircraft._id
                                )

                                // Check if start time is within timeframe of any flight.
                                let flight: Flight | undefined = undefined

                                if (selectedStartTime == selectedEndTime) {
                                  setSelectedEndTime(selectedEndTime + 2)
                                }

                                if (selectedStartTime > selectedEndTime) {
                                  let prevStartTime = selectedStartTime
                                  setSelectedStartTime(selectedEndTime)
                                  setSelectedEndTime(prevStartTime)
                                }

                                flights?.forEach((currentFlight) => {
                                  if (
                                    hourInRange(
                                      currentFlight,
                                      selectedStartTime
                                    )
                                  ) {
                                    flight = currentFlight
                                  }
                                })

                                // Check if end time is within timeframe of any flight.
                                flights?.forEach((currentFlight) => {
                                  // TODO: Fix from hour back to selectedEndTime working theory is it has something to do wiht the run time of java hehe
                                  if (hourInRange(currentFlight, hour)) {
                                    let newEndTime = flight?.endTime
                                    let startTimeOfCurrentFlight =
                                      currentFlight.startTime
                                    newEndTime = startTimeOfCurrentFlight - 1

                                    setSelectedEndTime(newEndTime)
                                  }
                                })

                                setSelectedFlight(flight)

                                // case 1: startTime is within range of some flight in flights -> UPDATE
                                // case 2: endTime is within range of some flight in flights -> DO NOTHING
                                // case 3: neither startTime nor endTime is within range of some flight in flights -> SUBMIT

                                // setSelectedFlight(???????)
                                setSelectedAircraft(aircraft)
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
        startTime={selectedStartTime}
        date={dateOfFlights}
        endTime={selectedEndTime}
        showModal={showModal}
        setShowModal={setShowModal}
        getFlights={getFlights}
        flight={selectedFlight}
        times={times}
      />
    </div>
  )
}

export default Schedule
