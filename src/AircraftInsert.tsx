import React from 'react'
import './App.css'
import { useState, useEffect } from 'react'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import { authGet, authPost } from './authHelpers'
import { Formik, Field, Form as FormikForm, FormikHelpers } from 'formik'
import { Link, useNavigate } from 'react-router-dom'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import { Aircraft, AirworthinessDirective } from './models/Aircraft'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import * as Yup from 'yup'
import ResponseError from './ResponseError'

const Aircrafts: React.FC = () => {
  const navigate = useNavigate()
  const [responseError, setResponseError] = useState<string>()
  const [annualCheckDate, setAnnualCheckDate] = useState<Date | null>(
    new Date()
  )
  const [vorCheckDate, setVorCheckDate] = useState<Date | null>(new Date())

  const [airWorthinessDirectiveCheckDate, setAirWorthinessDirectiveCheckDate] =
    useState<Date | null>(new Date())

  const [eltCheckDate, setEltCheckDate] = useState<Date | null>(new Date())

  const [transponderCheckDate, setTransponderCheckDate] = useState<Date | null>(
    new Date()
  )

  const [altimeterCheckDate, setAltimeterCheckDate] = useState<Date | null>(
    new Date()
  )

  const postAircraft = async (aircraftObject: Aircraft) => {
    const statusCode = await authPost(
      'http://localhost:5555/aircrafts',
      aircraftObject
    )
  }

  const SignupSchema = Yup.object().shape({
    name: Yup.string()
      .min(2, 'Too Short!')
      .max(50, 'Too Long!')
      .required('Required'),
    year: Yup.number().integer().positive().required('Required'),
  })

  return (
    <Container className="text-center h6">
      <Row>
        <Col>
          <div>
            <h1 style={{ textAlign: 'center' }}>Aircrafts</h1>
            <Formik
              initialValues={{
                _id: '',
                groupId: '',
                name: '',
                year: -1,
                annualCheckDate: '',
                vorCheckDate: '',
                oneHundredHourCheck: 0,
                eltCheckDate: '',
                transponderCheckDate: '',
                altimeterCheckDate: '',
              }}
              validationSchema={SignupSchema}
              onSubmit={async (
                values: Aircraft,
                { setSubmitting }: FormikHelpers<Aircraft>
              ) => {
                // TODO: REMOVE THIS EXCLAMATION POINT / DEAL WITH NULLNESS
                // VALIDATE THAT A DATE HAS BEEN CHOSEN BEFORE SUBMITTING

                // WE DO NOT HANDLE ERRORS.
                // TODO: HANDLE ERRORS.

                try {
                  values.annualCheckDate = annualCheckDate!.toISOString()
                  values.vorCheckDate = vorCheckDate!.toISOString()

                  // values.airWorthinessDirectivesCheckDate =
                  //   airWorthinessDirectiveCheckDate!.toISOString()

                  values.eltCheckDate = eltCheckDate!.toISOString()
                  values.transponderCheckDate =
                    transponderCheckDate!.toISOString()
                  values.altimeterCheckDate = altimeterCheckDate!.toISOString()

                  await postAircraft(values)
                  navigate('/home')
                } catch (error) {
                  setResponseError('Can not submit information at this time.')
                }

                // TODO: TALK ABOUT SUBMITTING BEHAVIOR LATER.
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
                    <Col className="mx-auto" lg={4} md={6} sm={8} xs={10}>
                      <Row className="mb-1">
                        <Form.Group className="mb-3" controlId="formName">
                          <Form.Label className="text-light">Name</Form.Label>
                          <Form.Control
                            name="name"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values['name']}
                            type="name"
                            placeholder="Enter the planes name"
                          />
                          {errors.name && touched.name ? (
                            <div className="text-danger">
                              <small>{errors.name}</small>
                            </div>
                          ) : null}
                        </Form.Group>
                      </Row>

                      <Row className="mb-1">
                        <Form.Group className="mb-3" controlId="formYear">
                          <Form.Label className="text-light">Year</Form.Label>
                          <Form.Control
                            name="year"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values['year']}
                            type="year"
                            placeholder="Enter the year"
                          />
                          {errors.year && touched.year ? (
                            <div className="text-danger">
                              <small>{errors.year}</small>
                            </div>
                          ) : null}
                        </Form.Group>
                      </Row>

                      <Row className="mb-1">
                        <Form.Group className="mb-3" controlId="formYear">
                          <Form.Label className="text-light">
                            Annual Check Date
                          </Form.Label>
                          <DatePicker
                            className="w-100 p-2 rounded mb-2"
                            selected={annualCheckDate}
                            onChange={(date) => setAnnualCheckDate(date)}
                          />
                        </Form.Group>
                      </Row>

                      <Row className="mb-1">
                        <Form.Group className="mb-3" controlId="formYear">
                          <Form.Label className="text-light">
                            VOR Check Date
                          </Form.Label>
                          <DatePicker
                            className="w-100 p-2 rounded mb-2"
                            selected={vorCheckDate}
                            onChange={(date) => setVorCheckDate(date)}
                          />
                        </Form.Group>
                      </Row>

                      <Row className="mb-1">
                        <Form.Group className="mb-3" controlId="formYear">
                          <Form.Label className="text-light">
                            100 Hour
                          </Form.Label>
                          <Form.Control
                            name="oneHundredHourCheck"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values['oneHundredHourCheck']}
                            type="number"
                            placeholder="Enter the Hobbs time"
                          />
                          {errors.year && touched.year ? (
                            <div className="text-danger">
                              <small>{errors.year}</small>
                            </div>
                          ) : null}
                        </Form.Group>
                      </Row>

                      <Row className="mb-1">
                        <Form.Group className="mb-3" controlId="formYear">
                          <Form.Label className="text-light">
                            Airworthiness Directive
                          </Form.Label>
                          <DatePicker
                            className="w-100 p-2 rounded mb-2"
                            selected={airWorthinessDirectiveCheckDate}
                            onChange={(date) =>
                              setAirWorthinessDirectiveCheckDate(date)
                            }
                          />
                        </Form.Group>
                      </Row>

                      <Row className="mb-1">
                        <Form.Group className="mb-3" controlId="formYear">
                          <Form.Label className="text-light">ELT</Form.Label>
                          <DatePicker
                            className="w-100 p-2 rounded mb-2"
                            selected={eltCheckDate}
                            onChange={(date) => setEltCheckDate(date)}
                          />
                        </Form.Group>
                      </Row>

                      <Row className="mb-1">
                        <Form.Group className="mb-3" controlId="formYear">
                          <Form.Label className="text-light">
                            Transponder
                          </Form.Label>
                          <DatePicker
                            className="w-100 p-2 rounded mb-2"
                            selected={transponderCheckDate}
                            onChange={(date) => setTransponderCheckDate(date)}
                          />
                        </Form.Group>
                      </Row>

                      <Row className="mb-1">
                        <Form.Group className="mb-3" controlId="formYear">
                          <Form.Label className="text-light">
                            Altimeter
                          </Form.Label>
                          <DatePicker
                            className="w-100 p-2 rounded mb-2"
                            selected={altimeterCheckDate}
                            onChange={(date) => setAltimeterCheckDate(date)}
                          />
                        </Form.Group>
                      </Row>

                      {/* <Row className="mb-1">
                        <Form.Group className="mb-3" controlId="formYear">
                          <Form.Label>Group</Form.Label>
                          <Form.Control
                            name="groupId"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values['groupId']}
                            type="string"
                            placeholder="Enter the group"
                          />
                        </Form.Group>
                      </Row> */}

                      <Row>
                        <Button type="submit">Submit</Button>
                      </Row>

                      <ResponseError responseError={responseError} />
                    </Col>
                  </Container>
                </FormikForm>
              )}
            </Formik>
          </div>
        </Col>
      </Row>
    </Container>
  )
}

export default Aircrafts
