import React from 'react'
import './App.css'
import './AircraftCard.css'
import { useState } from 'react'
import Card from 'react-bootstrap/Card'
import { Aircraft } from './models/Aircraft'
import Button from 'react-bootstrap/Button'
import { authDelete } from './authHelpers'
import { Link } from 'react-router-dom'
import Modal from 'react-bootstrap/Modal'

type Props = {
  aircraft: Aircraft
  getAircrafts: Function
}

const AircraftCard: React.FC<Props> = ({ aircraft, getAircrafts }) => {
  const [show, setShow] = useState(false)
  const handleClose = () => setShow(false)
  const handleShow = () => setShow(true)

  const deleteAircraft = async (id: string) => {
    const statusCode = await authDelete(`http://localhost:5555/aircrafts/${id}`)
    // TODO: HANDLE ERRORS CORRECTLY USING TRY/CATCH BLOCK.
  }

  return (
    <>
      <Card style={{ width: '18rem' }} className="card-link">
        <Card.Img variant="top" src={'temp'} />

        <Card.Body>
          <Link to={`/aircraftdetails/${aircraft._id}`} state={aircraft}>
            <Card.Title>{aircraft.name}</Card.Title>
            <Card.Text>{aircraft._id}</Card.Text>
          </Link>
        </Card.Body>

        <Button
          onClick={async () => {
            // TODO: this will live in the modal logic
            // try {
            //   await deleteAircraft(aircraft._id)
            //   getAircrafts()
            //   // REFRESH THE PAGE USING THE FUNCTION FROM HOME.TSX
            // } catch (error) {
            //   // TODO: DO SOMETHING
            //   console.log('didnt get aircraft buddy')
            // }
          }}
        >
          Delete
        </Button>
      </Card>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Modal heading</Modal.Title>
        </Modal.Header>
        <Modal.Body>Woohoo, you're reading this text in a modal!</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleClose}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default AircraftCard
