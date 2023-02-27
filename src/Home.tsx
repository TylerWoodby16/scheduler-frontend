import React from 'react'
import axios from 'axios'
import './App.css'
import { useState, useEffect } from 'react'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import { authGet } from './authHelpers'
import './Home.css'
import { Aircraft } from './models/Aircraft'
import AircraftCard from './AircraftCard'

const Home: React.FC = () => {
  const [aircrafts, setAircrafts] = useState<Aircraft[]>([])

  const getAircrafts = async () => {
    try {
      const data = await authGet<Aircraft[]>('http://localhost:5555/aircrafts')
      setAircrafts(data)
    } catch (error: any) {
      console.log('error: ' + error)
    }
  }

  useEffect(() => {
    getAircrafts()
  }, [])

  return (
    <Row className="home m-3 g-4">
      {aircrafts.map((aircraft, index) => {
        return (
          <Col key={index} xs={12} lg={4}>
            <AircraftCard
              id={aircraft._id}
              image="placeholder image"
              name={aircraft.name}
            />
          </Col>
        )
      })}
    </Row>
  )
}

export default Home
