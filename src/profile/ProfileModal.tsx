import React from 'react'
import { useState, useEffect } from 'react'
import { Aircraft, AirworthinessDirective } from '../models/Aircraft'
import { User } from '../models/User'
import { Button } from 'react-bootstrap'
import { Formik, Form as FormikForm, FormikHelpers } from 'formik'
import Form from 'react-bootstrap/Form'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import DatePicker from 'react-datepicker'
import { authGet, authPost, authUpdate } from '../authHelpers'
import Modal from 'react-bootstrap/Modal'
import ResponseError from '../ResponseError'

type Props = {
  user: User
  showModal: boolean
  setShowModal: Function
  getUser: Function
}

const EmergencyContactModal: React.FC<Props> = ({
  user,
  showModal,
  setShowModal,
  getUser,
}) => {
  const [responseError, setResponseError] = useState<string>()

  const updateUser = async (user: User) => {
    // TODO: NEED TO HANDLE ERRORS.
    const statusCode = await authUpdate(
      `http://localhost:5555/users/${user._id}`,
      user
    )
  }

  return (
    <Modal
      show={showModal}
      onHide={() => {
        setShowModal(false)
        setResponseError(undefined)
      }}
    >
      <Modal.Header />
      <Modal.Body>
        {/* Formik Form here  */}
        Would you like to update {user.firstName}?
        <h1 style={{ textAlign: 'center' }}>Update User</h1>
        <Formik
          initialValues={
            {
              _id: user._id,
              email: user.email,
              firstName: user.firstName,
              lastName: user.lastName,
              groupId: user.groupId,
              emergencyContact: user.emergencyContact,
              photoId: user.photoId,
              commercialLicense: user.commercialLicense,
              medicalCertificate: user.medicalCertificate,
              flightInstructorCertificate: user.flightInstructorCertificate,
              tsaCitizenship: user.tsaCitizenship,
              tsaSecurity: user.tsaSecurity,
              currency141: user.currency141,
              endorsements: user.endorsements,
              aircraftCheckout: user.aircraftCheckout,
            } as User
          }
          onSubmit={async (
            values: User,
            { setSubmitting }: FormikHelpers<User>
          ) => {
            await updateUser(values)

            // Clean up page after updating.
            await getUser()
            setSubmitting(false)
            setShowModal(false)
          }}
        >
          {({
            values,
            errors,
            touched,
            handleChange,
            handleBlur,
            handleSubmit,
            isSubmitting,
          }) => (
            <FormikForm onSubmit={handleSubmit}>
              <Container>
                <Col className="mx-auto">
                  <Row className="mb-1">
                    <Form.Group
                      className="mb-3"
                      controlId="formEmergencyContact"
                    >
                      <Form.Label className="text-light">Name</Form.Label>
                      <Form.Control
                        name="emergencyContact"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.emergencyContact}
                        type="string"
                        placeholder="Enter the planes name"
                      />
                      {errors.emergencyContact && touched.emergencyContact ? (
                        <div className="text-danger">
                          <small>{errors.emergencyContact}</small>
                        </div>
                      ) : null}
                    </Form.Group>
                  </Row>

                  <Row>
                    <Button type="submit">Submit</Button>
                  </Row>

                  <ResponseError responseError={responseError} />
                </Col>
              </Container>
            </FormikForm>
          )}
        </Formik>
        <ResponseError responseError={responseError} />
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="secondary"
          onClick={() => {
            setShowModal(false)
            setResponseError(undefined)
          }}
        >
          Cancel
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export default EmergencyContactModal
