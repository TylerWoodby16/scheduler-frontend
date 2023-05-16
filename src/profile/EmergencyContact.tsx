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
import ResponseError from '../ResponseError'
import * as Yup from 'yup'
import './EmergencyContact.css'

interface Props {
  user?: User
}

const EmergencyContactDetails: React.FC<Props> = ({ user }) => {
  const SignupSchema = Yup.object().shape({
    name: Yup.string()
      .min(2, 'Too Short!')
      .max(50, 'Too Long!')
      .required('Required'),
    phone: Yup.string()
      .matches(/^(\+?\d{1,4}[ -]?)?\d{10}$/, 'Invalid phone number')
      .required('Required'),
    relationship: Yup.string()
      .min(2, 'Too Short!')
      .max(50, 'Too Long!')
      .required('Required'),
  })
  const [formDisabled, setFormDisabled] = useState(true)
  const [errorCode, setErrorCode] = useState<number>()

  if (!user) return null

  // TODO: ADD YUP

  return (
    <div>
      <Formik
        initialValues={
          {
            // TODO change this
            name: user.emergencyContact ? user.emergencyContact.name : '',
            phone: user.emergencyContact ? user.emergencyContact.phone : '',
            relationship: user.emergencyContact
              ? user.emergencyContact.relationship
              : '',
          } as EmergencyContact
        }
        validationSchema={SignupSchema}
        onSubmit={async (
          values: EmergencyContact,
          { setSubmitting }: FormikHelpers<EmergencyContact>
        ) => {
          user.emergencyContact = values

          try {
            await authUpdate(`http://localhost:5555/users/${user._id}`, user)
            setFormDisabled(true)
          } catch (error: any) {
            setErrorCode(error.response.status)
          }

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
                <Row className="p-4">
                  <Form.Group controlId="formName">
                    <Form.Label className="pb-2 text-2xl">Name</Form.Label>
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
                  {errors.name && touched.name ? (
                    <div className="text-danger">
                      <small>{errors.name}</small>
                    </div>
                  ) : null}
                </Row>

                <Row className="p-4">
                  <Form.Group controlId="formPhone">
                    <Form.Label className="pb-2 text-2xl">
                      Phone Number: enter the numbers only
                    </Form.Label>
                    <Form.Control
                      name="phone"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.phone}
                      type="string"
                      placeholder="Phone Number: enter only the numbers"
                      disabled={formDisabled}
                    />
                  </Form.Group>
                  {errors.phone && touched.phone ? (
                    <div className="text-danger">
                      <>{errors.phone}</>
                    </div>
                  ) : null}
                </Row>

                <Row className="p-4">
                  <Form.Group controlId="formRelationship">
                    <Form.Label className="pb-2 text-2xl">
                      Relationship
                    </Form.Label>
                    <Form.Control
                      name="relationship"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.relationship}
                      type="string"
                      placeholder="Relationship"
                      disabled={formDisabled}
                    />
                  </Form.Group>
                  {errors.relationship && touched.relationship ? (
                    <div className="text-danger">
                      <small>{errors.relationship}</small>
                    </div>
                  ) : null}
                </Row>

                <ResponseError statusCode={errorCode} />

                <Row className="p-4">
                  {formDisabled ? (
                    <Button
                      variant="success"
                      onClick={() =>
                        setTimeout(() => {
                          setFormDisabled(false) // TODO: FIGURE OUT A WAY TO REMOVE THIS DELAY
                        }, 1)
                      }
                    >
                      Edit
                    </Button>
                  ) : (
                    <Button type="submit">Save</Button>
                  )}
                </Row>
              </Col>
            </Container>
          </FormikForm>
        )}
      </Formik>
    </div>
  )
}

export default EmergencyContactDetails
