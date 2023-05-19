import Container from 'react-bootstrap/Container'
import Button from 'react-bootstrap/Button'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import { FlightInstructorCertifcate, User } from '../models/User'
import { useState } from 'react'
import { Formik, Form as FormikForm, FormikHelpers } from 'formik'
import Form from 'react-bootstrap/Form'
import { authUpdate } from '../authHelpers'
import ResponseError from '../ResponseError'
// import * as Yup from 'yup'
import './EmergencyContact.css'
import DatePicker from 'react-datepicker'

interface Props {
  user?: User
}

const FlightInstructorCertComp: React.FC<Props> = ({ user }) => {
  // const SignupSchema = Yup.object().shape({
  //   // TODO 50 states all have different schemas is this worth it ?
  //   // idnumber: Yup.string()
  //   //   .min(2, 'Too Short!')
  //   //   .max(50, 'Too Long!')
  //   //   .required('Required'),
  //   experationdate: Yup.date()
  //     .min(new Date(), 'Date must be in the future')
  //     .required('Date is required'),
  // })
  const [formDisabled, setFormDisabled] = useState(true)
  const [errorCode, setErrorCode] = useState<number>()

  const [issuedDate, setIssuedDate] = useState<Date | null>(
    user?.commercialLicense?.issuedDate
      ? new Date(user?.commercialLicense?.issuedDate)
      : null
  )

  const [expiration, setExpiration] = useState<Date | null>(
    user?.flightInstructorCertificate?.expiration
      ? new Date(user?.flightInstructorCertificate?.expiration)
      : null
  )

  if (!user) return null

  // TODO: ADD YUP

  return (
    <div>
      <Formik
        initialValues={
          {
            // TODO change this
            number: user.flightInstructorCertificate
              ? user.flightInstructorCertificate.number
              : '',
            issuedDate: user.flightInstructorCertificate
              ? user.flightInstructorCertificate.issuedDate
              : '',
            expiration: user.flightInstructorCertificate
              ? user.flightInstructorCertificate.expiration
              : '',

            categoryClass: user.flightInstructorCertificate
              ? user.flightInstructorCertificate.categoryClass
              : '',
            ratingsEndorsements: user.flightInstructorCertificate
              ? user.flightInstructorCertificate.ratingsEndorsements
              : '',
            restrictionsLimitations: user.flightInstructorCertificate
              ? user.flightInstructorCertificate.restrictionsLimitations
              : '',
          } as FlightInstructorCertifcate
        }
        // validationSchema={SignupSchema}
        onSubmit={async (
          values: FlightInstructorCertifcate,
          { setSubmitting }: FormikHelpers<FlightInstructorCertifcate>
        ) => {
          user.flightInstructorCertificate = values
          // TODO: possibly need to shove the date picker times into values

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
                  <Form.Group controlId="formNumber">
                    <Form.Label className="pb-2 text-2xl">
                      Certifciation number
                    </Form.Label>
                    <Form.Control
                      name="number"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.number}
                      type="number"
                      placeholder="enter certification number: enter only the numbers"
                      disabled={formDisabled}
                    />
                  </Form.Group>
                  {errors.number && touched.number ? (
                    <div className="text-danger">
                      <>{errors.number}</>
                    </div>
                  ) : null}
                </Row>

                <Row className="mb-1">
                  <Form.Group className="mb-3" controlId="formIssuedDate">
                    <Form.Label className="text-light">Issued Date</Form.Label>
                    <DatePicker
                      className="w-100 p-2 rounded mb-2"
                      selected={issuedDate}
                      onChange={(date) => setIssuedDate(date)}
                      disabled={formDisabled}
                    />
                  </Form.Group>
                </Row>

                {/* TODO: does this need an error like the others ?  */}

                <Row className="mb-1">
                  <Form.Group className="mb-3" controlId="formExpiration">
                    <Form.Label className="text-light">
                      Expiration Date
                    </Form.Label>
                    <DatePicker
                      className="w-100 p-2 rounded mb-2"
                      selected={expiration}
                      onChange={(date) => setExpiration(date)}
                      disabled={formDisabled}
                    />
                  </Form.Group>
                </Row>
                {/* TODO: does this need an error like the others ?  */}

                {/* TODO: this probably needs to be an array */}
                <Row className="p-4">
                  <Form.Group controlId="formCategoryClass">
                    <Form.Label className="pb-2 text-2xl">
                      Category Class
                    </Form.Label>
                    <Form.Control
                      name="certificateType"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.categoryClass}
                      type="string"
                      placeholder="Category/Class"
                      disabled={formDisabled}
                    />
                  </Form.Group>
                  {/* TODO: does this need to be the respnse error comp? */}
                  {errors.categoryClass && touched.categoryClass ? (
                    <div className="text-danger">
                      <small>{errors.categoryClass}</small>
                    </div>
                  ) : null}
                </Row>

                {/* TODO: this probably needs to be an array */}
                <Row className="p-4">
                  <Form.Group controlId="formRatingsEndorsements">
                    <Form.Label className="pb-2 text-2xl">
                      Ratings/Endorsements
                    </Form.Label>
                    <Form.Control
                      name="ratingsEndorsements"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.ratingsEndorsements}
                      type="string"
                      placeholder="Ratings/Endorsements"
                      disabled={formDisabled}
                    />
                  </Form.Group>
                  {/* TODO: does this need to be the respnse error comp? */}
                  {errors.ratingsEndorsements && touched.ratingsEndorsements ? (
                    <div className="text-danger">
                      <small>{errors.ratingsEndorsements}</small>
                    </div>
                  ) : null}
                </Row>

                {/* TODO: this probably needs to be an array */}
                <Row className="p-4">
                  <Form.Group controlId="formRestrictionsLimitations">
                    <Form.Label className="pb-2 text-2xl">
                      Restrictions/Limitations
                    </Form.Label>
                    <Form.Control
                      name="restrictionsLimitations"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.restrictionsLimitations}
                      type="string"
                      placeholder="Restrictions/Limitations"
                      disabled={formDisabled}
                    />
                  </Form.Group>
                  {/* TODO: does this need to be the respnse error comp? */}
                  {errors.restrictionsLimitations &&
                  touched.restrictionsLimitations ? (
                    <div className="text-danger">
                      <small>{errors.restrictionsLimitations}</small>
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

export default FlightInstructorCertComp
