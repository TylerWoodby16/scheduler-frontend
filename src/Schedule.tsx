import React from 'react'
import { useState, useEffect, useRef } from 'react'
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

  // TODO: Could we use useRef here? My hunch is NO but worth an experiment.
  const [selectedFlight, setSelectedFlight] = useState<Flight>()
  const [selectedAircraft, setSelectedAircraft] = useState<Aircraft>()

  // const [selectedStartTime, setSelectedStartTime] = useState<Date>(new Date())
  const selectedStartTime = useRef(new Date())
  const selectedEndTime = useRef(new Date())

  const [aircraftIdToFlights, setAircraftIdToFLights] = useState<
    Map<string, Flight[]>
  >(new Map<string, Flight[]>())

  // Get starting DateTime based on datepicker's current day.
  // Defaults to 12:00:00AM
  const [times, setTimes] = useState<Date[]>([]) // TODO: COULD THIS BE A REGULAR VARIABLE? or at least useRef?

  let lowerBoundaryTime = useRef(new Date())
  let upperBoundaryTime = useRef(new Date())

  // Used for setting a boundary on the pointerDown function
  // TODO: Can simply use Dates here with setHour(0,0,0,0)
  const setDefaultBoundaryTimes = () => {
    let midNightToday = DateTime.local(
      dateFromDatePicker.getFullYear(),
      dateFromDatePicker.getMonth() + 1,
      dateFromDatePicker.getDate()
    )

    let midNightTomorrow = DateTime.local(
      dateFromDatePicker.getFullYear(),
      dateFromDatePicker.getMonth() + 1,
      dateFromDatePicker.getDate() + 1
    )

    lowerBoundaryTime.current = midNightToday.toJSDate()
    upperBoundaryTime.current = midNightTomorrow.toJSDate()
  }

  const buildScheduleTimes = () => {
    // Begin by getting 12AM today.
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
    } catch (error: any) {
      setResponseError('There was an error getting flights.')
    }
  }

  useEffect(() => {
    getAircrafts()
    getFlights()
    buildScheduleTimes()
    setDefaultBoundaryTimes()
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

  const dateInRange = (flight: Flight, time: Date) => {
    // flight.startTime / flight.endTime is actually a (zulu time formatted) string for some reason.
    // We convert to Date here to localize it and ACTUALLY make it a Date.
    return time >= new Date(flight.startTime) && time < new Date(flight.endTime)
  }

  const highlightFlightBox = (
    flights: Flight[] | undefined,
    time: Date
  ): boolean => {
    if (!flights) return false

    let inRange = false
    flights.forEach((flight) => {
      // flight.startTime / flight.endTime is actually a (zulu time formatted) string for some reason.
      // We convert to Date here to localize it and ACTUALLY make it a Date.
      if (
        time >= new Date(flight.startTime) &&
        time < new Date(flight.endTime)
      ) {
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
                        <>
                          {time.getHours()}:{time.getMinutes()}
                          {Number(time.getMinutes()) == 0 ? '0' : ''}
                        </>
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
                                selectedStartTime.current = time

                                let flightsForAircraft =
                                  aircraftIdToFlights?.get(aircraft._id)

                                if (!flightsForAircraft)
                                  flightsForAircraft = [] as Flight[]

                                // What is the endTime of the flight BELOW my current clicked time
                                // and what is the startTime of the flight ABOVE my current clicked time

                                // Loop through flightsForAircraft. The first flight with start time ABOVE our current time
                                // will be the UPPER BOUNDING FLIGHT. Then, whatever index upper bounding flight was, the LOWER
                                // BOUNDING FLIGHT will be index - 1.
                                let boundaryNotFound = true
                                flightsForAircraft.forEach((flight, index) => {
                                  // Find first flight above currently selected time.
                                  if (
                                    selectedStartTime.current <
                                      new Date(flight.startTime) &&
                                    boundaryNotFound
                                  ) {
                                    upperBoundaryTime.current = new Date(
                                      flight.startTime
                                    )

                                    boundaryNotFound = false

                                    if (index != 0) {
                                      lowerBoundaryTime.current = new Date(
                                        flightsForAircraft![index - 1].endTime
                                      )
                                    }

                                    console.log(
                                      'upper ' + upperBoundaryTime.current
                                    )
                                    console.log(
                                      'low ' + lowerBoundaryTime.current
                                    )
                                    // Otherwise, do nothing and use default value (midnight today).
                                  }
                                })

                                // Possibly flights below and not above.
                                if (
                                  boundaryNotFound &&
                                  flightsForAircraft.length != 0
                                ) {
                                  lowerBoundaryTime.current = new Date(
                                    flightsForAircraft[
                                      flightsForAircraft.length - 1
                                    ].endTime
                                  )
                                }
                              }}
                              onPointerUp={(e) => {
                                if (time < upperBoundaryTime.current) {
                                  selectedEndTime.current = time
                                } else {
                                  selectedEndTime.current =
                                    upperBoundaryTime.current
                                }

                                if (time < lowerBoundaryTime.current) {
                                  selectedEndTime.current =
                                    lowerBoundaryTime.current
                                }

                                // If we are selecting backwards, flip start time and end time.
                                if (
                                  selectedEndTime.current <
                                  selectedStartTime.current
                                ) {
                                  let prevStartTime = selectedStartTime.current

                                  selectedStartTime.current =
                                    selectedEndTime.current

                                  selectedEndTime.current = prevStartTime
                                }

                                const flightsForAircraft =
                                  aircraftIdToFlights?.get(aircraft._id)

                                // Check if start time is within timeframe of any flight.
                                let flight: Flight | undefined = undefined

                                // INSIDE -> OUT
                                flightsForAircraft?.forEach(
                                  (currentFlight, index) => {
                                    if (
                                      dateInRange(
                                        currentFlight,
                                        selectedStartTime.current
                                      )
                                    ) {
                                      flight = currentFlight
                                      setDefaultBoundaryTimes()

                                      if (flightsForAircraft.length > 1) {
                                        if (
                                          index !=
                                          flightsForAircraft.length - 1
                                        ) {
                                          upperBoundaryTime.current = new Date(
                                            flightsForAircraft[
                                              index + 1
                                            ].startTime
                                          )
                                        }

                                        if (index != 0) {
                                          lowerBoundaryTime.current = new Date(
                                            flightsForAircraft[
                                              index - 1
                                            ].endTime
                                          )
                                        }
                                      }
                                    }
                                  }
                                )

                                setSelectedFlight(flight)

                                // case 1: startTime is within range of some flight in flights -> UPDATE
                                // case 2: endTime is within range of some flight in flights -> DO NOTHING
                                // case 3: neither startTime nor endTime is within range of some flight in flights -> SUBMIT
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
        startTime={selectedStartTime.current}
        date={dateOfFlights}
        endTime={selectedEndTime.current}
        showModal={showModal}
        setShowModal={setShowModal}
        getFlights={getFlights}
        flight={selectedFlight}
        times={times}
        lowerBoundaryTime={lowerBoundaryTime}
        upperBoundaryTime={upperBoundaryTime}
        setDefaultBoundaryTimes={setDefaultBoundaryTimes}
      />
    </div>
  )
}

export default Schedule
