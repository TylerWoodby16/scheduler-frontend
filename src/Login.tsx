import { useState } from 'react'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import Nav from 'react-bootstrap/Nav'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { Formik, Form as FormikForm, FormikHelpers } from 'formik'

interface Values {
  email: string
  password: string
}

const Login = () => {
  const navigate = useNavigate()
  const [responseError, setResponseError] = useState<string>()

  return (
    <div>
      <h1 style={{ textAlign: 'center' }}>Login</h1>
      <Formik
        initialValues={{
          email: '',
          password: '',
        }}
        onSubmit={async (
          values: Values,
          { setSubmitting }: FormikHelpers<Values>
        ) => {
          axios
            .post('http://localhost:5555/login', values)
            .then((response) => {
              localStorage.setItem('token', response.data.token)
              navigate('/schedule')
            })
            .catch((error) => {
              if (
                error.response &&
                (error.response.status === 401 || error.response.status === 404)
              ) {
                setResponseError(error.response.data)
              } else {
                setResponseError('Error.')
              }
            })
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
                  <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      name="email"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values['email']}
                      type="email"
                      placeholder="Enter your email"
                    />
                  </Form.Group>
                </Row>

                <Row className="mb-1">
                  <Form.Group className="mb-3" controlId="formBasicPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                      name="password"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values['password']}
                      type="password"
                      placeholder="Enter your password"
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

              <Nav className="justify-content-center" activeKey="/schedule">
                <Nav.Item>
                  <Nav.Link as={Link} to="/forgotpassword">
                    Forgot Password?
                  </Nav.Link>
                </Nav.Item>
              </Nav>
            </Container>
          </FormikForm>
        )}
      </Formik>
    </div>
  )
}

export default Login
