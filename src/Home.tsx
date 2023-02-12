import React from 'react'
import axios from 'axios'
import './App.css'
import { useState, useEffect } from 'react'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import { authGet } from './authHelpers'
import './Home.css'
import AircraftCard from './AircraftCard'

type AircraftCard = {
  name: string
  _id: string
  year: number
  groupId: string
}

const Home: React.FC = () => {
  const [aircrafts, setAircrafts] = useState<AircraftCard[]>([])

  const getAircrafts = async () => {
    try {
      const data = await authGet<AircraftCard[]>(
        'http://localhost:5555/aircrafts'
      )
      setAircrafts(data)
    } catch (error: any) {
      console.log('error: ' + error)
    }
  }

  useEffect(() => {
    getAircrafts()
  }, [])

  return (
    <Container className="width: 20px mt-3">
      <Row className="g-4">
        {aircrafts.map((aircraft, index) => {
          return (
            <Col key={index} xs={12} lg={4}>
              <AircraftCard image="placeholder image" name={aircraft.name} />
            </Col>
          )
        })}
      </Row>
    </Container>
  )
}

export default Home
