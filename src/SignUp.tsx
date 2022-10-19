import * as React from "react";
import * as ReactDOM from "react-dom";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import * as Yup from "yup";
import { Formik, Field, Form as FormikForm, FormikHelpers } from "formik";
import axios from "axios";
import { useState, useEffect } from "react";

interface Values {
  firstName: string;
  lastName: string;
  email: string;
}



const SignupForm: React.FC<any> = () => {
  const SignupSchema = Yup.object().shape({
    firstName: Yup.string()
      .min(2, "Too Short!")
      .max(50, "Too Long!")
      .required("Required"),
    lastName: Yup.string()
      .min(2, "Too Short!")
      .max(50, "Too Long!")
      .required("Required"),
    email: Yup.string().email("Invalid email").required("Required"),
  });

  return (
    <div>
      <h1 style={{ textAlign: "center" }}>SignUp</h1>
      <Formik
        initialValues={{
          firstName: "",
          lastName: "",
          email: "",
          // password: "",
          // confirmPassword: "",
        }}
        validationSchema={SignupSchema}
        onSubmit={(
          values: Values,
          { setSubmitting }: FormikHelpers<Values>
        ) => {
          axios
            .post("http://localhost:8000/aircrafts", values) // no try/catch here
            .then((response) => {
              console.log(response);
              // setUserLoggedIn(values.lastName);
            })
            .catch((error) => {
              console.log(error.response);
            });
          console.log({ values });
          alert(JSON.stringify(values, null, 2));
          setSubmitting(false);
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
            <Container
              className="mx-auto ml=1 mr=5"
              style={{
                backgroundColor: "#E0E0E0",
              }}
            >
              <Col className="mx-auto" lg={4} md={6} sm={8} xs={10}>
                <Row className="mb-1">
                  <Form.Group className="mb-3" controlId="formBasicFirstName">
                    <Form.Label>First Name</Form.Label>
                    <Form.Control
                      name="firstName"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values["firstName"]}
                      type="text"
                      placeholder="Enter first name"
                    />
                    {errors.firstName && touched.firstName ? (
                      <div className="text-danger">
                        <small>{errors.firstName}</small>
                      </div>
                    ) : null}
                  </Form.Group>
                </Row>

                <Row className="mb-1">
                  <Form.Group className="mb-3" controlId="formBasicLastName">
                    <Form.Label>Last Name</Form.Label>
                    <Form.Control
                      name="lastName"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values["lastName"]}
                      type="text"
                      placeholder="Enter last name"
                    />
                    {errors.lastName && touched.lastName ? (
                      <div className="text-danger">
                        <small>{errors.lastName}</small>
                      </div>
                    ) : null}
                  </Form.Group>
                </Row>

                <Row className="mb-1">
                  <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      name="email"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values["email"]}
                      type="email"
                      placeholder="Enter your email"
                    />
                    {errors.email && touched.email ? (
                      <div className="text-danger">
                        <small>{errors.email}</small>
                      </div>
                    ) : null}
                  </Form.Group>
                </Row>
                <Row>
                  <Button type="submit">Submit</Button>
                </Row>
              </Col>
            </Container>
          </FormikForm>
        )}
      </Formik>
    </div>
  );
};

export default SignupForm;
