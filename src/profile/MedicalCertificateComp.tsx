import Container from 'react-bootstrap/Container'
import Button from 'react-bootstrap/Button'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import { CommercialLicense, MedicalCertificate, User } from '../models/User'
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

const MedicalCertificateComp: React.FC<Props> = ({ user }) => {
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

  const [examDate, setExamDate] = useState<Date | null>(
    user?.medicalCertificate?.examDate
      ? new Date(user?.medicalCertificate?.examDate)
      : null
  )
  const [dateOfBirth, setDateOfBirth] = useState<Date | null>(
    user?.medicalCertificate?.dateOfBirth
      ? new Date(user?.medicalCertificate?.dateOfBirth)
      : null
  )
  const [firstClassPrivExp, setFirstClassPrivExp] = useState<Date | null>(
    user?.medicalCertificate?.firstClassPrivExp
      ? new Date(user?.medicalCertificate?.firstClassPrivExp)
      : null
  )
  const [secondClassPrivExp, setSecondClassPrivExp] = useState<Date | null>(
    user?.medicalCertificate?.secondClassPrivExp
      ? new Date(user?.medicalCertificate?.secondClassPrivExp)
      : null
  )
  const [thirdClassPrivExp, setThirdClassPrivExp] = useState<Date | null>(
    user?.medicalCertificate?.thirdClassPrivExp
      ? new Date(user?.medicalCertificate?.thirdClassPrivExp)
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
            class: user.medicalCertificate ? user.medicalCertificate.class : '',

            number: user.medicalCertificate
              ? user.medicalCertificate.number
              : '',

            dateOfBirth: user.medicalCertificate
              ? user.medicalCertificate.dateOfBirth
              : '',

            examDate: user.medicalCertificate
              ? user.medicalCertificate.examDate
              : '',

            firstClassPrivExp: user.medicalCertificate
              ? user.medicalCertificate.firstClassPrivExp
              : '',

            secondClassPrivExp: user.medicalCertificate
              ? user.medicalCertificate.secondClassPrivExp
              : '',

            thirdClassPrivExp: user.medicalCertificate
              ? user.medicalCertificate.thirdClassPrivExp
              : '',

            restrictionsLimitations: user.medicalCertificate
              ? user.medicalCertificate.restrictionsLimitations
              : '',
          } as MedicalCertificate
        }
        // validationSchema={SignupSchema}
        onSubmit={async (
          values: MedicalCertificate,
          { setSubmitting }: FormikHelpers<MedicalCertificate>
        ) => {
          user.medicalCertificate = values
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
                  <Form.Group controlId="formClass">
                    <Form.Label className="pb-2 text-2xl">
                      Class of Medical
                    </Form.Label>
                    <Form.Control
                      name="certificateType"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.class}
                      type="string"
                      placeholder="Class of Medical"
                      disabled={formDisabled}
                    />
                  </Form.Group>
                  {/* TODO: does this need to be the respnse error comp? */}
                  {errors.class && touched.class ? (
                    <div className="text-danger">
                      <small>{errors.class}</small>
                    </div>
                  ) : null}
                </Row>
                <Row className="p-4">
                  <Form.Group controlId="formMedicalNumber">
                    <Form.Label className="pb-2 text-2xl">
                      Medical License number
                    </Form.Label>
                    <Form.Control
                      name="medicalLicenseNumber"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.number}
                      type="number"
                      placeholder="enter Medical License number: enter only the numbers"
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
                  <Form.Group className="mb-3" controlId="formDateOfBirth">
                    <Form.Label className="text-light">
                      Date Of Birth
                    </Form.Label>
                    <DatePicker
                      className="w-100 p-2 rounded mb-2"
                      selected={dateOfBirth}
                      onChange={(date) => setDateOfBirth(date)}
                      disabled={formDisabled}
                    />
                  </Form.Group>
                </Row>

                {/* TODO: does this need an error like the others ?  */}

                <Row className="mb-1">
                  <Form.Group className="mb-3" controlId="formExamDate">
                    <Form.Label className="text-light">Date of Exam</Form.Label>
                    <DatePicker
                      className="w-100 p-2 rounded mb-2"
                      selected={examDate}
                      onChange={(date) => setExamDate(date)}
                      disabled={formDisabled}
                    />
                  </Form.Group>
                </Row>
                {/* TODO: does this need an error like the others ?  */}

                <Row className="mb-1">
                  <Form.Group
                    className="mb-3"
                    controlId="formFirstClassExamExp"
                  >
                    <Form.Label className="text-light">
                      First Class Privlidges Expiration
                    </Form.Label>
                    <DatePicker
                      className="w-100 p-2 rounded mb-2"
                      selected={firstClassPrivExp}
                      onChange={(date) => setFirstClassPrivExp(date)}
                      disabled={formDisabled}
                    />
                  </Form.Group>
                </Row>
                {/* TODO: does this need an error like the others ?  */}

                <Row className="mb-1">
                  <Form.Group
                    className="mb-3"
                    controlId="formSecondClassPrivExp"
                  >
                    <Form.Label className="text-light">
                      Second Class Privlidges Expiration
                    </Form.Label>
                    <DatePicker
                      className="w-100 p-2 rounded mb-2"
                      selected={secondClassPrivExp}
                      onChange={(date) => setSecondClassPrivExp(date)}
                      disabled={formDisabled}
                    />
                  </Form.Group>
                </Row>
                {/* TODO: does this need an error like the others ?  */}

                <Row className="mb-1">
                  <Form.Group className="mb-3" controlId="formThirdClassPriv">
                    <Form.Label className="text-light">
                      Third Class Privlidges Expiration
                    </Form.Label>
                    <DatePicker
                      className="w-100 p-2 rounded mb-2"
                      selected={thirdClassPrivExp}
                      onChange={(date) => setThirdClassPrivExp(date)}
                      disabled={formDisabled}
                    />
                  </Form.Group>
                </Row>
                {/* TODO: does this need an error like the others ?  */}

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

export default MedicalCertificateComp
