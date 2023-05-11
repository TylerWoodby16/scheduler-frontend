import Container from 'react-bootstrap/Container'
import Nav from 'react-bootstrap/Nav'
import Navbar from 'react-bootstrap/Navbar'
import { Link } from 'react-router-dom'
import { useLocation } from 'react-router-dom'
import Button from 'react-bootstrap/Button'
import { useNavigate } from 'react-router-dom'
import { getToken, hasToken } from '../authHelpers'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import { User } from '../models/User'
import { useState } from 'react'
import {
  Formik,
  FormikHelpers,
  FormikProps,
  Form,
  Field,
  FieldProps,
} from 'formik'

interface Props {
  user: User
}

const EmergencyContact: React.FC<Props> = ({ user }) => {
  // const initialValues: MyFormValues = { firstName: '' }
  const [formDisabled, setFormDisabled] = useState(true)
  return (
    <div>
      {/* <Formik
        initialValues={{
          firstname: '',
        }}
        onSubmit={(values, actions) => {
          // console.log({ values, actions })
          // alert(JSON.stringify(values, null, 2))
          actions.setSubmitting(false)
        }}
      >
        <Form>
          <label htmlFor="firstName">First Name</label>
          <Field
            id="firstName"
            name="firstName"
            placeholder="First Name"
            disabled={formDisabled}
          />
          <button type="submit">Submit</button>
        </Form>
        <Button
          onClick={() => {
            setFormDisabled(false)
          }}
        >
          Update
        </Button>
      </Formik> */}

      {/* <Row>name: {user?.emergencyContact}</Row>
      <Row>phone: </Row>
      <Row>relationship:</Row> */}
    </div>
  )
}

export default EmergencyContact
