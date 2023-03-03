import React from 'react'
import './App.css'
import { useState, useEffect } from 'react'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import { authGet, authPost, authUpdate } from './authHelpers'
import { Formik, Field, Form as FormikForm, FormikHelpers } from 'formik'
import { Link, useNavigate } from 'react-router-dom'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import { Aircraft } from './models/Aircraft'

const AircraftsUpdateGentle: React.FC = () => {
  const [responseError, setResponseError] = useState<string>()

  const updateAircraft = async (aircraftObject: Aircraft) => {
    const statusCode = await authUpdate(
      'http://localhost:5555/aircrafts/gentleUpsert',
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
                groupId: '', // maybe to do with jwt ??
                annualCheckDate: '',
              }}
              onSubmit={async (
                values: Aircraft,
                { setSubmitting }: FormikHelpers<Aircraft>
              ) => {
                // WE DO NOT HANDLE ERRORS.
                // TODO: HANDLE ERRORS.
                await updateAircraft(values)

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
                        <Form.Group className="mb-3" controlId="formId">
                          <Form.Label>ID</Form.Label>
                          <Form.Control
                            name="_id"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values['_id']}
                            type="string"
                            placeholder="Enter the planes ID"
                          />
                        </Form.Group>
                      </Row>

                      <Row className="mb-1">
                        <Form.Group className="mb-3" controlId="formName">
                          <Form.Label>Name</Form.Label>
                          <Form.Control
                            name="name"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values['name']}
                            type="string"
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
                            type="number"
                            placeholder="Enter the year"
                          />
                        </Form.Group>
                      </Row>
                      <Row className="mb-1">
                        <Form.Group className="mb-3" controlId="formYear">
                          <Form.Label>Group</Form.Label>
                          <Form.Control
                            name="groupId"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values['groupId']}
                            type="string"
                            placeholder="Enter the Group"
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

export default AircraftsUpdateGentle
