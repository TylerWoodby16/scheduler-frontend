import Container from 'react-bootstrap/Container'
import Button from 'react-bootstrap/Button'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import { Currency141, User } from '../models/User'
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

const Currency141Comp: React.FC<Props> = ({ user }) => {
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

            expiration: user.tsaSecurity ? user.tsaSecurity.expiration : '',
          } as Currency141
        }
        // validationSchema={SignupSchema}
        onSubmit={async (
          values: Currency141,
          { setSubmitting }: FormikHelpers<Currency141>
        ) => {
          user.currency141 = values
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

export default Currency141Comp
