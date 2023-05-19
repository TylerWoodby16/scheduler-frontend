import Container from 'react-bootstrap/Container'
import Button from 'react-bootstrap/Button'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import { PhotoId, TSACitizenship, User } from '../models/User'
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

const TSACitizenComp: React.FC<Props> = ({ user }) => {
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

  if (!user) return null

  // TODO: ADD YUP

  return (
    <div>
      <Formik
        initialValues={
          {
            // TODO change this
            type: user.tsaCitizenship ? user.tsaCitizenship.type : '',
          } as TSACitizenship
        }
        // validationSchema={SignupSchema}
        onSubmit={async (
          values: TSACitizenship,
          { setSubmitting }: FormikHelpers<TSACitizenship>
        ) => {
          user.tsaCitizenship = values

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
                  <Form.Group controlId="formTSACitizenshipType">
                    <Form.Label className="pb-2 text-2xl">
                      TSACitizenshipType
                    </Form.Label>
                    <Form.Control
                      name="photoId"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.type}
                      type="string"
                      placeholder="TSACitizenshipType"
                      disabled={formDisabled}
                    />
                  </Form.Group>
                  {errors.type && touched.type ? (
                    <div className="text-danger">
                      <>{errors.type}</>
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

export default TSACitizenComp
