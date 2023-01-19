import React from 'react'
import axios from 'axios'
import './App.css'
import { useState, useEffect } from 'react'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import { authGet, authPost, authUpdate } from './authHelpers'
import { Formik, Field, Form as FormikForm, FormikHelpers } from 'formik'
import { Link, useNavigate } from 'react-router-dom'
import Button from 'react-bootstrap/Button'
import Nav from 'react-bootstrap/Nav'
import Form from 'react-bootstrap/Form'

export type Aircraft = {
  _id: string
  name: string
  year: number
}

const AircraftsUpdate: React.FC = () => {
  const navigate = useNavigate()
  const [responseError, setResponseError] = useState<string>()
  const [aircrafts, setAircrafts] = useState<Aircraft[]>([])

  const postAircraft = async (aircraftObject: Aircraft) => {
    const statusCode = await authPost(
      'http://localhost:5555/aircrafts',
      aircraftObject
    )
  }
  
  const updateAircraft = async (aircraftObject: Aircraft) => {
    const statusCode = await authUpdate(
      'http://localhost:5555/aircrafts/bruteUpsert',
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
                _id: '',
                name: '',
                year: -1,
              }}
              onSubmit={async (
                values: Aircraft,
                { setSubmitting }: FormikHelpers<Aircraft>
              ) => {
                // WE DO NOT HANDLE ERRORS.
                // TODO: HANDLE ERRORS.
                await updateAircraft(values)

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

export default AircraftsUpdate
