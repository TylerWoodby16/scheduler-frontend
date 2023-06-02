import Container from 'react-bootstrap/Container'
import Button from 'react-bootstrap/Button'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import { PhotoId, User } from '../models/User'
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

const PhotoIdentification: React.FC<Props> = ({ user }) => {
  // const SignupSchema = Yup.object().shape({
  //   TODO 50 states all have different schemas is this worth it ?
  //   idnumber: Yup.string()
  //     .min(2, 'Too Short!')
  //     .max(50, 'Too Long!')
  //     .required('Required'),
  //   experationdate: Yup.date()
  //     .min(new Date(), 'Date must be in the future')
  //     .required('Date is required'),
  // })
  const [formDisabled, setFormDisabled] = useState(true)
  const [errorCode, setErrorCode] = useState<number>()

  const [experationDate, setExperationDate] = useState<Date | null>(
    user?.photoId?.experationDate
      ? new Date(user?.photoId?.experationDate)
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
            number: user.photoId ? user.photoId.number : '',
            experationDate: user.photoId ? user.photoId.experationDate : '',
          } as PhotoId
        }
        // validationSchema={SignupSchema}
        onSubmit={async (
          values: PhotoId,
          { setSubmitting }: FormikHelpers<PhotoId>
        ) => {
          user.photoId = values
          values.experationDate = experationDate!.toISOString()

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
                  <Form.Group controlId="formPhotoID">
                    <Form.Label className="pb-2 text-2xl">
                      Photo ID number
                    </Form.Label>
                    <Form.Control
                      className={formDisabled ? 'form-control-disabled' : ''}
                      name="photoId"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.number}
                      type="number"
                      placeholder="enter Photo Id number: enter only the numbers"
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
                  <Form.Group className="mb-3" controlId="formExperationDate">
                    <Form.Label className="text-light">
                      Experation Date
                    </Form.Label>
                    <DatePicker
                      className={
                        formDisabled
                          ? ' w-100 p-2 rounded mb-2 input-custom'
                          : ''
                      }
                      selected={experationDate}
                      onChange={(date) => setExperationDate(date)}
                      disabled={formDisabled}
                    />
                  </Form.Group>
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

export default PhotoIdentification
