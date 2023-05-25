import React from 'react'
import './AppointmentModal.css'
import { useState } from 'react'
import './AircraftDetails.css'
import { Aircraft } from './models/Aircraft'
import { Button } from 'react-bootstrap'
import { Formik, Form as FormikForm, FormikHelpers } from 'formik'
import Form from 'react-bootstrap/Form'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import DatePicker from 'react-datepicker'
import { authUpdate } from './authHelpers'
import Modal from 'react-bootstrap/Modal'
import ResponseError from './ResponseError'

type Props = {
  aircraft: Aircraft | undefined
  time: number | undefined
  showModal: boolean
  setShowModal: Function
}

const AppointmentModal: React.FC<Props> = ({
  aircraft,
  time,
  showModal,
  setShowModal,
}) => {
  const [errorCode, setErrorCode] = useState<number>()

  return (
    <>
      <Modal
        show={showModal}
        onHide={() => {
          setShowModal(false)
          setErrorCode(undefined)
        }}
      >
        <Modal.Header />
        <Modal.Body>
          {/* Formik Form here  */}
          {aircraft ? aircraft.name : null}
          <h1 style={{ textAlign: 'center' }}>{time}</h1>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => {
              setShowModal(false)
              setErrorCode(undefined)
            }}
          >
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default AppointmentModal
