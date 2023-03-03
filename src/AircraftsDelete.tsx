import React from 'react'
import './App.css'
import { useState } from 'react'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import { authDelete } from './authHelpers'
import { Formik, Field, Form as FormikForm, FormikHelpers } from 'formik'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import { Aircraft } from './models/Aircraft'

const AircraftsDelete: React.FC = () => {
  const [responseError, setResponseError] = useState<string>()

  const deleteAircraft = async (aircraftObject: Aircraft) => {
    const statusCode = await authDelete(
      `http://localhost:5555/aircrafts/${aircraftObject._id}`
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
                groupId: '',
                annualCheckDate: '',
              }}
              onSubmit={async (
                values: Aircraft,
                { setSubmitting }: FormikHelpers<Aircraft>
              ) => {
                // WE DO NOT HANDLE ERRORS.
                // TODO: HANDLE ERRORS.
                await deleteAircraft(values)

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

export default AircraftsDelete
