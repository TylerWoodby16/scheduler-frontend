import React from 'react'
import './App.css'
import { useState, useEffect } from 'react'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import { authGet } from './authHelpers'
import './Home.css'
import { Aircraft } from './models/Aircraft'
import AircraftCard from './AircraftCard'
import ResponseError from './ResponseError'

const Home: React.FC = () => {
  const [aircrafts, setAircrafts] = useState<Aircraft[]>([])
  const [responseError, setResponseError] = useState<string>()

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
    <>
      <ResponseError responseError={responseError} />

      <Row className="home m-3 g-4">
        {aircrafts.map((aircraft, index) => {
          return (
            <Col key={index} xs={12} lg={4}>
              <AircraftCard aircraft={aircraft} getAircrafts={getAircrafts} />
            </Col>
          )
        })}
      </Row>
    </>
  )
}

export default Home
