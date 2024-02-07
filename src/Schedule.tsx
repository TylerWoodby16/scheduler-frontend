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

  const selectedStartTime = useRef(new Date())
  const selectedEndTime = useRef(new Date())

  let [pointerDownActived, setPointerDownActived] = useState<boolean>(false)

  let [aircraftIdToHighlightedTimes, setAircraftIdToHighlightedTimes] =
    useState<Map<string, Date[]>>(new Map<string, Date[]>())

  // First attempt at getting all possible start times
  const [possibleStartTimes, setPossibleStartTimes] = useState<Date[]>([])

  const [flights, setFlights] = useState<Flight[]>()

  const [aircraftIdToFlights, setAircraftIdToFLights] = useState<
    Map<string, Flight[]>
  >(new Map<string, Flight[]>())

  // Get starting DateTime based on datepicker's current day.
  // Defaults to 12:00:00AM
  const [times, setTimes] = useState<Date[]>([]) // TODO: COULD THIS BE A REGULAR VARIABLE? or at least useRef?

  let lowerBoundaryTime = useRef(new Date())
  let upperBoundaryTime = useRef(new Date())

  console.log('render')

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

  const settingUpperAndLowerBoundaryTimeIfInsideFlight = (
    flightsForAircraft: Flight[]
  ) => {
    flightsForAircraft.forEach((currentFlight, index) => {
      // Check if we pointer down in an existing flight's time (which is a date) range.
      if (dateInRange(currentFlight, selectedStartTime.current)) {
        // flight = currentFlight
        setDefaultBoundaryTimes()

        // this is for if we are in a flight

        // If more than one flight exists, and we are NOT selecting the last one,
        // make the upper boundary time the START time of the NEXT flight.
        if (flightsForAircraft!.length > 1) {
          if (index != flightsForAircraft!.length - 1) {
            upperBoundaryTime.current = new Date(
              flightsForAircraft![index + 1].startTime
            )
          }

          // If we are not selecting the FIRST flight, make the lower boundary time
          // the END time of the previous flight.
          if (index != 0) {
            lowerBoundaryTime.current = new Date(
              flightsForAircraft![index - 1].endTime
            )
          }
        }
      }
    })
  }

  const settingUpperAndLowerBoundaryTimeNotInFlight = (
    flightsForAircraft: Flight[]
  ) => {
    let boundaryNotFound = true
    flightsForAircraft.forEach((flight, index) => {
      // Find first flight above currently selected time.
      if (
        selectedStartTime.current < new Date(flight.startTime) &&
        boundaryNotFound
      ) {
        upperBoundaryTime.current = new Date(flight.startTime)

        boundaryNotFound = false

        if (index != 0) {
          lowerBoundaryTime.current = new Date(
            flightsForAircraft[index - 1].endTime
          )
        }

        // Otherwise, do nothing and use default value (midnight today).
      }
    })

    // Possibly flights below and not above.

    if (boundaryNotFound && flightsForAircraft?.length != 0) {
      lowerBoundaryTime.current = new Date(
        flightsForAircraft[flightsForAircraft.length - 1].endTime
      )
    }
  }

  //This is not repeat logic of the above functions
  //It is different because the User has essentially moved the pointerDown click
  //SO this is a generalized version of both functions above with props
  // Possible a refactor where I replace the above functions with just this one

  const updateBoundaryTimes = (
    flightsForAircraft: Flight[],
    selectedStartTime: Date,
    lowerBoundaryTime: React.MutableRefObject<Date>,
    upperBoundaryTime: React.MutableRefObject<Date>
  ) => {
    // Set default boundary times.
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

    // Find upper and lower boundaries if they should exist.
    let upperBoundaryNotFound = true
    flightsForAircraft.forEach((flight, index) => {
      // Find first flight above currently selected time.
      if (
        selectedStartTime < new Date(flight.startTime) &&
        upperBoundaryNotFound
      ) {
        upperBoundaryTime.current = new Date(flight.startTime)

        upperBoundaryNotFound = false

        if (index != 0) {
          lowerBoundaryTime.current = new Date(
            flightsForAircraft[index - 1].endTime
          )
        }

        // Otherwise, do nothing and use default value (midnight today).
      }
    })

    // Possibly flights below and not above.
    if (upperBoundaryNotFound && flightsForAircraft?.length != 0) {
      lowerBoundaryTime.current = new Date(
        flightsForAircraft[flightsForAircraft.length - 1].endTime
      )
    }
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
      // possibly just make the flights usestate and set it here ?
      setFlights(data)
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

  const createFilteredTimes = (
    times: Date[],
    flights: Flight[],
    selectedFlight?: Flight
  ) => {
    const filteredTimes = times.filter((time) => {
      let inRange = false

      // This returns an array of times excluding the times associated with the current 'clicked' flight
      const unselectedFlights = flights.filter((currentFlight) => {
        return !(currentFlight == selectedFlight)
      })

      unselectedFlights.forEach((flight) => {
        if (dateInRange(flight, time)) {
          inRange = true
        }
      })

      return !inRange
    })

    return filteredTimes
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

  // TODO: When I come back explain to yourself what you are trying to do
  // clean the code up start from there
  let booleanThatINeedToRename = false

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

      <Container style={{ color: 'white' }} className="container-scroll">
        <Row>
          <Col className="sticky-left">
            <Row>Name Time</Row>
            {aircrafts.map((aircraft, index) => {
              return (
                <Row style={{ backgroundColor: '#3498db' }}>
                  {aircraft.name}
                </Row>
              )
            })}
          </Col>

          {times.map((time, index) => {
            return (
              <Col className="gx-0">
                <Row>
                  {time.getHours()}:{time.getMinutes()}
                  {Number(time.getMinutes()) == 0 ? '0' : ''}{' '}
                </Row>

                {aircrafts.map((aircraft, index) => {
                  return (
                    <Row
                      style={{ cursor: 'pointer' }}
                      key={index}
                      // TODO: Look at this later. Does it matter that we are not iterating per row anymore? We now iterate per-column. Does this affect flight detection?
                      className={
                        // highlightFlightBox(
                        //   aircraftIdToFlights?.get(aircraft._id),
                        //   time
                        // )
                        //   ? 'scheduledFlightBox'
                        //   : ''

                        aircraftIdToHighlightedTimes
                          .get(aircraft._id)
                          ?.includes(time)
                          ? 'scheduledFlightBox'
                          : ''

                        // highlightFlightBoxWhileDragging(
                        //   aircraft,
                        //   time,
                        //   mapOfAircraftNameToTimesCreatedToHighlightBox
                        // )
                        //   ? 'scheduledFlightBox'
                        //   : ''
                      }
                      onPointerDown={(e) => {
                        setPointerDownActived(true)

                        setAircraftIdToHighlightedTimes(
                          aircraftIdToHighlightedTimes?.set(aircraft._id, [
                            time,
                          ])
                        )

                        // everything below was here before working on highlighting on pointerDown
                        selectedStartTime.current = time

                        let flightsForAircraft = aircraftIdToFlights?.get(
                          aircraft._id
                        )

                        if (!flightsForAircraft)
                          flightsForAircraft = [] as Flight[]

                        // Check if start time is within timeframe of any flight.
                        let flight: Flight | undefined = undefined

                        // Check if we pointer down in an existing flight's time (which is a date) range.
                        flightsForAircraft.forEach((currentFlight) => {
                          if (
                            dateInRange(
                              currentFlight,
                              selectedStartTime.current
                            )
                          ) {
                            flight = currentFlight
                          }
                        })
                        setSelectedFlight(flight)

                        if (flightsForAircraft) {
                          setPossibleStartTimes(
                            createFilteredTimes(
                              times,
                              flightsForAircraft,
                              flight
                            )
                          )
                        } else {
                          setPossibleStartTimes(times)
                        }

                        // Set boundary times
                        if (flight) {
                          settingUpperAndLowerBoundaryTimeIfInsideFlight(
                            flightsForAircraft
                          )
                        } else {
                          settingUpperAndLowerBoundaryTimeNotInFlight(
                            flightsForAircraft
                          )
                        }
                      }}
                      onPointerMove={(e) => {
                        if (pointerDownActived) {
                          // const highlightedTimes =
                          //   aircraftIdToHighlightedTimes.get(aircraft._id)

                          const highlightedTimes = aircraftIdToHighlightedTimes
                            .values()
                            .next().value

                          console.log(highlightedTimes)

                          // const highlightedTimes = aircraftIdToHighlightedTimes.get(aircraftIdToHighlightedTimes.keys().next().value)

                          if (highlightedTimes) highlightedTimes[1] = time

                          aircraftIdToHighlightedTimes.set(
                            aircraft._id,
                            highlightedTimes
                          )

                          setAircraftIdToHighlightedTimes(
                            new Map(aircraftIdToHighlightedTimes)
                          )

                          // console.log(
                          //   aircraftIdToHighlightedTimes.get(aircraft._id)
                          // )

                          //   if (
                          //     !aircraftIdToHighlightedTimes
                          //       .get(aircraft._id)
                          //       ?.includes(time)
                          //   ) {
                          //     aircraftIdToHighlightedTimes
                          //       .get(aircraft._id)
                          //       ?.push(time)
                          //     // It is telling me to use the spread operator
                          //     // because we need to create a new object or array when updating the state to trigger a re-render. React relies on immutability to determine when to re-render components.
                          //     // Instead of modifying the existing aircraftIdToHighlightedTimes directly, create a new copy of it using the spread operator:
                          //     setAircraftIdToHighlightedTimes(
                          //       new Map(aircraftIdToHighlightedTimes)
                          //     )
                          //   }
                        }
                      }}
                      onPointerUp={(e) => {
                        setPointerDownActived(false)

                        setAircraftIdToHighlightedTimes(
                          new Map<string, Date[]>()
                        )

                        // make setAircraftCreatedToHighlightBox a random aircraft so it forces highlightedSpecificBox to always be false
                        // setAircraftCreatedToHighlightBox(undefined)

                        // setTimeCreatedToHighlightBox(undefined)
                        // highlightFlightBoxWhileDragging(
                        //   aircraft,
                        //   timeCreatedToHighlightBox
                        // )
                        if (!selectedFlight) {
                          // if the time is greater than the upperboundary
                          // it will set itself to the upperboundary
                          // otherwise it stays the time it was
                          if (time < upperBoundaryTime.current) {
                            selectedEndTime.current = time
                          } else {
                            selectedEndTime.current = upperBoundaryTime.current
                          }
                          // if the time is less than the lowerBoundaryTime
                          // set time to be the lowerBoudnaryTime
                          if (time < lowerBoundaryTime.current) {
                            selectedEndTime.current = lowerBoundaryTime.current
                          }

                          // If we are selecting backwards, flip start time and end time.
                          if (
                            selectedEndTime.current < selectedStartTime.current
                          ) {
                            let prevStartTime = selectedStartTime.current

                            selectedStartTime.current = selectedEndTime.current

                            selectedEndTime.current = prevStartTime
                          }
                        }

                        // If start time and end time are the same
                        // Add 2 hours  (single click flight) bc this is the standard length
                        if (
                          selectedStartTime.current == selectedEndTime.current
                        ) {
                          selectedEndTime.current = new Date(
                            Number(selectedEndTime.current) + 7200000
                          )
                        }

                        setSelectedAircraft(aircraft)
                        setShowModal(true)
                      }}
                    >
                      {time.getHours()}
                    </Row>
                  )
                })}
              </Col>
            )
          })}
        </Row>
      </Container>

      {/* 
      <Container>
        <Row>
          <Col>
            <table className="table table-dark  table-bordered">
              <thead></thead>
              <tbody>
                <tr>
                  <th>name</th>

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

                                // Check if start time is within timeframe of any flight.
                                let flight: Flight | undefined = undefined

                                // Check if we pointer down in an existing flight's time (which is a date) range.
                                flightsForAircraft.forEach((currentFlight) => {
                                  if (
                                    dateInRange(
                                      currentFlight,
                                      selectedStartTime.current
                                    )
                                  ) {
                                    flight = currentFlight
                                  }
                                })
                                setSelectedFlight(flight)

                                if (flightsForAircraft) {
                                  setPossibleStartTimes(
                                    createFilteredTimes(
                                      times,
                                      flightsForAircraft,
                                      flight
                                    )
                                  )
                                } else {
                                  setPossibleStartTimes(times)
                                }

                                // Set boundary times
                                if (flight) {
                                  settingUpperAndLowerBoundaryTimeIfInsideFlight(
                                    flightsForAircraft
                                  )
                                } else {
                                  settingUpperAndLowerBoundaryTimeNotInFlight(
                                    flightsForAircraft
                                  )
                                }
                              }}
                              onPointerUp={(e) => {
                                if (!selectedFlight) {
                                  // if the time is greater than the upperboundary
                                  // it will set itself to the upperboundary
                                  // otherwise it stays the time it was
                                  if (time < upperBoundaryTime.current) {
                                    selectedEndTime.current = time
                                  } else {
                                    selectedEndTime.current =
                                      upperBoundaryTime.current
                                  }
                                  // if the time is less than the lowerBoundaryTime
                                  // set time to be the lowerBoudnaryTime
                                  if (time < lowerBoundaryTime.current) {
                                    selectedEndTime.current =
                                      lowerBoundaryTime.current
                                  }

                                  // If we are selecting backwards, flip start time and end time.
                                  if (
                                    selectedEndTime.current <
                                    selectedStartTime.current
                                  ) {
                                    let prevStartTime =
                                      selectedStartTime.current

                                    selectedStartTime.current =
                                      selectedEndTime.current

                                    selectedEndTime.current = prevStartTime
                                  }
                                }

                                // If start time and end time are the same
                                // Add 2 hours  (single click flight) bc this is the standard length
                                if (
                                  selectedStartTime.current ==
                                  selectedEndTime.current
                                ) {
                                  selectedEndTime.current = new Date(
                                    Number(selectedEndTime.current) + 7200000
                                  )
                                }

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
      </Container> */}

      <FlightModal
        aircraft={selectedAircraft}
        aircrafts={aircrafts}
        startTime={selectedStartTime.current}
        possibleStartTimes={possibleStartTimes}
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
        updateBoundaryTimes={updateBoundaryTimes}
        aircraftIdToFlights={aircraftIdToFlights}
      />
    </div>
  )
}

export default Schedule
