import React from 'react'
import './App.css'
import './AircraftCard.css'
import Card from 'react-bootstrap/Card'
import { Link } from 'react-router-dom'

type AircraftProps = {
  id: string
  name: string
  image: string
}

const AircraftCard: React.FC<AircraftProps> = ({ id, name, image }) => {
  return (
    <Card style={{ width: '18rem' }} className="card-link">
      <Link to={`/aircraftdetails/${id}`}>
        <Card.Img variant="top" src={image} />
        <Card.Body>
          <Card.Title>{name}</Card.Title>
          <Card.Text>{id}</Card.Text>
        </Card.Body>
      </Link>
    </Card>
  )
}

export default AircraftCard
