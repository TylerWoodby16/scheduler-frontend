import React from 'react'
import axios from 'axios'
import './App.css'
import { useState, useEffect } from 'react'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import { authGet } from './authHelpers'

type Aircraft = {
  name: string
  _id: string
  year: number
}

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
    <Container className="text-center h6">
      <Row>
        <Col>
          {aircrafts.map((aircraft, index) => {
            return (
              <div key={index}>
                {aircraft.name} {aircraft.year} {aircraft._id}
              </div>
            )
          })}
        </Col>
      </Row>
    </Container>
  )
}

export default Home
