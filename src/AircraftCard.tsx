import React from 'react'
import axios from 'axios'
import './App.css'
import { useState, useEffect } from 'react'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import './Home.css'
import Card from 'react-bootstrap/Card'
import { Link } from 'react-router-dom'
import Button from 'react-bootstrap/Button'
import OverlayTrigger from 'react-bootstrap/OverlayTrigger'
import Tooltip from 'react-bootstrap/Tooltip'

type AircraftProps = {
  name: string
  image: string
}

const AircraftCard: React.FC<AircraftProps> = ({ name, image }) => {
  return (
    // <Container className="col">
    //   <Col>{image}</Col>
    //   <Col>{name}</Col>
    // </Container>
    // I assume the link will have something to do with aircraft ID
    <Card style={{ width: '18rem' }}>
      <Link to="/aircrafts">
        <Card.Img variant="top" src={image} />
        <Card.Body>
          <Card.Title>{name}</Card.Title>
          <Card.Text>Some more details</Card.Text>
          {/* <Button variant="primary">View Details</Button> */}
        </Card.Body>
      </Link>
    </Card>
  )
}

export default AircraftCard
