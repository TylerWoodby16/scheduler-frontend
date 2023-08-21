import Container from 'react-bootstrap/Container'
import Button from 'react-bootstrap/Button'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import { EmergencyContact, User } from '../models/User'
import { useState } from 'react'
import { Formik, Form as FormikForm, FormikHelpers } from 'formik'
import Form from 'react-bootstrap/Form'
import { authUpdate } from '../authHelpers'
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
                    <Form.Label className="pb-2 text-2xl text-white">
                      Name
                    </Form.Label>
                    <Form.Control
                      className={formDisabled ? 'form-control-disabled' : ''}
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
                    <Form.Label className="pb-2 text-2xl text-white">
                      Phone Number: enter the numbers only
                    </Form.Label>
                    <Form.Control
                      className={formDisabled ? 'form-control-disabled' : ''}
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
                    <Form.Label className="pb-2 text-2xl text-white">
                      Relationship
                    </Form.Label>
                    <Form.Control
                      className={formDisabled ? 'form-control-disabled' : ''}
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
                    <>
                      <Button
                        className="btnColor"
                        onClick={() =>
                          setTimeout(() => {
                            setFormDisabled(false) // TODO: FIGURE OUT A WAY TO REMOVE THIS DELAY
                          }, 1)
                        }
                      >
                        Edit
                      </Button>
                    </>
                  ) : (
                    <Button type="submit" className="btnColor">
                      Save
                    </Button>
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
