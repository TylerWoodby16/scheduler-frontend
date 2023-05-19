import Container from 'react-bootstrap/Container'
import Button from 'react-bootstrap/Button'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import {
  AircraftCheckOut,
  Endorsements,
  FlightInstructorCertifcate,
  TSASecurity,
  User,
} from '../models/User'
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

const AircraftCheckOutComp: React.FC<Props> = ({ user }) => {
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

  const [date, setDate] = useState<Date | null>(
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
            makeModel: user.aircraftCheckout
              ? user.aircraftCheckout.makeModel
              : '',
          } as AircraftCheckOut
        }
        // validationSchema={SignupSchema}
        onSubmit={async (
          values: AircraftCheckOut,
          { setSubmitting }: FormikHelpers<AircraftCheckOut>
        ) => {
          user.aircraftCheckout = values
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
                  <Form.Group controlId="formMakeModel">
                    <Form.Label className="pb-2 text-2xl">
                      endorsments
                    </Form.Label>
                    <Form.Control
                      name="makeModel"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.makeModel}
                      type="string"
                      placeholder="make / model"
                      disabled={formDisabled}
                    />
                  </Form.Group>
                  {errors.makeModel && touched.makeModel ? (
                    <div className="text-danger">
                      <>{errors.makeModel}</>
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

export default AircraftCheckOutComp
