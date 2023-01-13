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
import Nav from 'react-bootstrap/Nav'
import Form from 'react-bootstrap/Form'

type Aircraft = {
  name: string
  year: number
}

// interface Values {
//   name: string;
//   year: string;
// }

const Aircrafts: React.FC = () => {
  const navigate = useNavigate()
  const [responseError, setResponseError] = useState<string>()
  const [aircrafts, setAircrafts] = useState<Aircraft[]>([])

  const postAircraft = async (aircraftObject: Aircraft) => {
    const statusCode = await authPost(
      'http://localhost:55546363465/aircrafts',
      aircraftObject
    )
  }

  return (
    <Container className="text-center h6">
      <Row>
        <Col>
          <div>
            <h1 style={{ textAlign: 'center' }}>Aircrafts</h1>
            <Formik
              initialValues={{
                name: '',
                year: -1,
              }}
              onSubmit={async (
                values: Aircraft,
                { setSubmitting }: FormikHelpers<Aircraft>
              ) => {
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
                        </Form.Group>
                      </Row>

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
