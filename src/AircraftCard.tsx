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
import ResponseError from './ResponseError'

type Props = {
  aircraft: Aircraft
  getAircrafts: Function
}

const AircraftCard: React.FC<Props> = ({ aircraft, getAircrafts }) => {
  const [show, setShow] = useState(false)
  const [responseError, setResponseError] = useState<string>()

  const deleteAircraft = async (id: string) => {
    await authDelete(`http://localhost:5555/aircrafts/${id}`)
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
            setShow(true)
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

      <Modal
        show={show}
        onHide={() => {
          setShow(false)
          setResponseError(undefined)
        }}
      >
        <Modal.Header />
        <Modal.Body>
          Are you sure you want to delete {aircraft.name}?
          <ResponseError responseError={responseError} />
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => {
              setShow(false)
              setResponseError(undefined)
            }}
          >
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={async () => {
              try {
                await deleteAircraft(aircraft._id)
                setShow(false)
                await getAircrafts()
              } catch (error: any) {
                setResponseError('There was an error delete aircrafts.')
              }
            }}
          >
            Delete Aircraft
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default AircraftCard
