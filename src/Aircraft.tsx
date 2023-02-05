import React from 'react'
import axios from 'axios'
import './App.css'
import { useState, useEffect } from 'react'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import { authGet } from './authHelpers'
import './Home.css'

type AircraftProps = {
  name: string
  image: string
}

const Aircraft: React.FC<AircraftProps> = ({ name, image }) => {
  return (
    <Container className="text-center h6">
      <Row>
        <Col>{image}</Col>
      </Row>
      <Row>
        <Col>{name}</Col>
      </Row>
    </Container>
  )
}

export default Aircraft
