import Container from 'react-bootstrap/Container'
import Nav from 'react-bootstrap/Nav'
import Navbar from 'react-bootstrap/Navbar'
import { Link } from 'react-router-dom'
import { useLocation } from 'react-router-dom'
import Button from 'react-bootstrap/Button'
import { useNavigate } from 'react-router-dom'
import { getToken, hasToken } from '../authHelpers'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import { EmergencyContact, User } from '../models/User'
import { useState } from 'react'
import axios from 'axios'
import { Formik, Field, Form as FormikForm, FormikHelpers } from 'formik'
import Form from 'react-bootstrap/Form'
import { authGet, authPost, authUpdate } from '../authHelpers'

interface Props {
  user?: User
}

const EmergencyContactDetails: React.FC<Props> = ({ user }) => {
  // const initialValues: MyFormValues = { firstName: '' }
  const [formDisabled, setFormDisabled] = useState(true)
  const [responseError, setResponseError] = useState<string>()

  const updateUser = async (user: User) => {
    // TODO: NEED TO HANDLE ERRORS.

    const statusCode = await authUpdate(
      `http://localhost:5555/users/${user._id}`,
      user
    )
  }

  if (!user) return null

  return (
    <div>
      <Formik
        initialValues={
          {
            // change this
            name: user.emergencyContact ? user.emergencyContact.name : '',
            phone: user.emergencyContact ? user.emergencyContact.phone : '',
            relationship: user.emergencyContact
              ? user.emergencyContact.relationship
              : '',
          } as EmergencyContact
        }
        onSubmit={async (
          values: EmergencyContact,
          { setSubmitting }: FormikHelpers<EmergencyContact>
        ) => {
          user.emergencyContact = values

          console.log('FIRED')

          // TODO HANDLE ERRORS
          await updateUser(user)

          setSubmitting(false)
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
              <Col>
                <Row>
                  <Form.Group controlId="formName">
                    <Form.Label>Name</Form.Label>
                    <Form.Control
                      name="name"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.name}
                      type="string"
                      placeholder="Name"
                      disabled={formDisabled}
                    />
                  </Form.Group>
                </Row>

                {/* TODO USE RESPONSEERROR COMPONENT */}
                {responseError ? (
                  <Row className="pb-3 text-center text-danger">
                    <Col>{responseError}</Col>
                  </Row>
                ) : null}

                <Row>
                  {formDisabled ? (
                    <Button onClick={() => setFormDisabled(false)}>Edit</Button>
                  ) : (
                    <Button type="submit" onClick={() => setFormDisabled(true)}>
                      Save
                    </Button>
                  )}
                </Row>
              </Col>
            </Container>
          </FormikForm>
        )}
      </Formik>

      {/* <Row>name: {user?.emergencyContact}</Row>
      <Row>phone: </Row>
      <Row>relationship:</Row> */}
    </div>
  )
}

export default EmergencyContactDetails
