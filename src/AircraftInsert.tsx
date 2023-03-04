import React from 'react'
import axios from 'axios'
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
import { Aircraft } from './models/Aircraft'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import * as Yup from 'yup'

const Aircrafts: React.FC = () => {
  const [responseError, setResponseError] = useState<string>()
  const [annualCheckDate, setAnnualCheckDate] = useState<Date | null>(
    new Date()
  )

  const postAircraft = async (aircraftObject: Aircraft) => {
    const statusCode = await authPost(
      'http://localhost:5555/aircrafts',
      aircraftObject
    )
  }

  // TODO: BRING IN YUP BABY
  // GIDDYUP
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
              }}
              validationSchema={SignupSchema}
              onSubmit={async (
                values: Aircraft,
                { setSubmitting }: FormikHelpers<Aircraft>
              ) => {
                // TODO: REMOVE THIS EXCLAMATION POINT / DEAL WITH NULLNESS
                // VALIDATE THAT A DATE HAS BEEN CHOSEN BEFORE SUBMITTING

                values.annualCheckDate = annualCheckDate!.toISOString()

                // WE DO NOT HANDLE ERRORS.
                // TODO: HANDLE ERRORS.

                await postAircraft(values)

                // .post("http://localhost:5555/aircrafts", values) //want to use postAircrafts
                // .then((response) => {
                //   localStorage.setItem("token", response.data.token);
                //   navigate("/home");
                // })
                // .catch((error) => {
                //   if(error.response && (error.response.status == 401 || error.response.status == 404)){
                //     setResponseError(error.response.data);
                //   } else {
                //     setResponseError("Error.")
                //   }

                // });
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
                          <Form.Label>Name</Form.Label>
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
                          <Form.Label>Year</Form.Label>
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
                          <Form.Label>Annual Check Date</Form.Label>
                          <DatePicker
                            selected={annualCheckDate}
                            onChange={(date) => setAnnualCheckDate(date)}
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

                      {responseError ? (
                        <Row className="pb-3 text-center text-danger">
                          <Col>{responseError}</Col>
                        </Row>
                      ) : null}

                      <Row>
                        <Button type="submit">Submit</Button>
                      </Row>
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
