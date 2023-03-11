import React from 'react'
import './App.css'
import './AircraftCard.css'
import Card from 'react-bootstrap/Card'
import { Link } from 'react-router-dom'
import { Aircraft } from './models/Aircraft'

type Props = {
  aircraft: Aircraft
}

const AircraftCard: React.FC<Props> = ({ aircraft }) => {
  return (
    <Card style={{ width: '18rem' }} className="card-link">
      <Link to={`/aircraftdetails/${aircraft._id}`} state={aircraft}>
        <Card.Img variant="top" src={'temp'} />
        <Card.Body>
          <Card.Title>{aircraft.name}</Card.Title>
          <Card.Text>{aircraft._id}</Card.Text>
        </Card.Body>
      </Link>
    </Card>
  )
}

export default AircraftCard
