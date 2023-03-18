import React from 'react'
import './App.css'
import './AircraftCard.css'
import Card from 'react-bootstrap/Card'
import { Aircraft } from './models/Aircraft'
import Button from 'react-bootstrap/Button'
import { authDelete } from './authHelpers'
import { Link, useNavigate } from 'react-router-dom'

type Props = {
  aircraft: Aircraft
}

const AircraftCard: React.FC<Props> = ({ aircraft }) => {
  const navigate = useNavigate()
  const deleteAircraft = async (id: string) => {
    const statusCode = await authDelete(`http://localhost:5555/aircrafts/${id}`)
    // TODO: HANDLE ERRORS CORRECTLY USING TRY/CATCH BLOCK.
  }

  return (
    <Card style={{ width: '18rem' }} className="card-link">
      <Card.Img variant="top" src={'temp'} />

      <Card.Body>
        <Link to={`/aircraftdetails/${aircraft._id}`} state={aircraft}>
          <Card.Title>{aircraft.name}</Card.Title>
          <Card.Text>{aircraft._id}</Card.Text>
        </Link>
      </Card.Body>

      {/* TODO: ON SUCCESSFUL DELETION, RE-HIT THE DB SO THAT WE GET NEW LIST */}
      <Button
        onClick={async () => {
          try {
            await deleteAircraft(aircraft._id)
            // REFRESH THE PAGE USING THE FUNCTION FROM HOME.TSX
            navigate('/home')
          } catch (error) {
            // TODO: DO SOMETHING
          }
        }}
      >
        Delete
      </Button>
    </Card>
  )
}

export default AircraftCard
