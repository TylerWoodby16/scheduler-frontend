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
import { createSecureContext } from 'tls'
import { createIncrementalCompilerHost, isFunctionLike } from 'typescript'

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
  const [selectedStartTime, setSelectedStartTime] = useState<Date>(new Date())
  // const [selectedStartTime, setSelectedStartTime] = useState<number>(-1)
  let [selectedEndTime, setSelectedEndTime] = useState<Date>(new Date())
  // let [selectedEndTime, setSelectedEndTime] = useState<number>(-1)

  const [aircraftIdToFlights, setAircraftIdToFLights] = useState<
    Map<string, Flight[]>
  >(new Map<string, Flight[]>())

  // Get starting DateTime based on datepicker's current day.
  // Defaults to 12:00:00AM
  const [times, setTimes] = useState<Date[]>([])

  const buildScheduleTimes = () => {
    const baseDateTime = DateTime.local(
      dateFromDatePicker.getFullYear(),
      dateFromDatePicker.getMonth() + 1,
      dateFromDatePicker.getDate()
    )

    const hourDivision = 4 // 1 = hourly, 2 = half hour, 4 = 15 minutes
    const times: Date[] = []

    for (let hour = 0; hour < 24; hour++) {
      const hourDateTime = baseDateTime.plus({ hours: hour })
      for (let increment = 0; increment < hourDivision; increment++) {
        const minuteDateTime = hourDateTime.plus({
          minutes: increment * (60 / hourDivision),
        })

        times.push(minuteDateTime.toJSDate())
      }
    }

    setTimes(times)
  }

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
    buildScheduleTimes()
  }, [dateFromDatePicker])

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

  // TODO: Make this work with the Date type
  const dateInRange = (flight: Flight, time: Date) => {
    return time > flight.startTime && time < flight.endTime
  }

  // TODO: Make this work with the Date type
  const highlightFlightBox = (
    flights: Flight[] | undefined,
    time: Date
  ): boolean => {
    if (!flights) return false

    let inRange = false
    flights.forEach((flight) => {
      // TODO: CHECK THAT THIS DATE COMPARISON WORKS.
      if (time > flight.startTime && time < flight.endTime) {
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
                  {/* start here with making new hour the question is how  */}
                  {/* Why do I care this isnt a number probably so we can do different increments of time  */}
                  {/* So as long as I start with an iterable number this is a good starting point  */}
                  {times.map((time, index) => {
                    return (
                      <th key={index}>
                        {time.getHours()}:{time.getMinutes()}
                      </th>
                    )
                  })}
                </tr>
                {aircrafts.map((aircraft, index) => {
                  return (
                    <tr key={index}>
                      <td key={index}>
                        {aircraft.name} {aircraft._id}
                      </td>
                      {times.map((time, index) => {
                        return (
                          <>
                            <td
                              key={index}
                              className={
                                highlightFlightBox(
                                  aircraftIdToFlights?.get(aircraft._id),
                                  time
                                )
                                  ? 'scheduledFlightBox'
                                  : ''
                              }
                              onPointerDown={(e) => {
                                setSelectedStartTime(time)
                              }}
                              onPointerMove={(e) => {
                                // console.log(hour)
                              }}
                              onPointerUp={(e) => {
                                setSelectedEndTime(time)
                                console.log(time)
                                const flights = aircraftIdToFlights?.get(
                                  aircraft._id
                                )

                                // Check if start time is within timeframe of any flight.
                                let flight: Flight | undefined = undefined

                                if (selectedStartTime > selectedEndTime) {
                                  let prevStartTime = selectedStartTime
                                  setSelectedStartTime(selectedEndTime)
                                  setSelectedEndTime(prevStartTime)
                                }

                                flights?.forEach((currentFlight) => {
                                  if (
                                    dateInRange(
                                      currentFlight,
                                      selectedStartTime
                                    )
                                  ) {
                                    flight = currentFlight
                                  }
                                })

                                // Check if end time is within timeframe of any flight.
                                // flights?.forEach((currentFlight) => {
                                //   // TODO: Fix from hour back to selectedEndTime working theory is it has something to do wiht the run time of java hehe
                                //   if (dateInRange(currentFlight, time)) {
                                //     let newEndTime = flight?.endTime
                                //     let startTimeOfCurrentFlight =
                                //       currentFlight.startTime
                                //     newEndTime = startTimeOfCurrentFlight

                                //     setSelectedEndTime(newEndTime)
                                //   }
                                // })

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
        // follow this down
        times={times}
      />
    </div>
  )
}

export default Schedule
