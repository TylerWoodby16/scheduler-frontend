import React from 'react'
import Alert from 'react-bootstrap/Alert'

interface Props {
  responseError?: string | undefined
  statusCode?: number
}

const ResponseError: React.FC<Props> = ({ responseError, statusCode }) => {
  const typeOfError = (code: number) => {
    if (code >= 400 && code < 500) {
      return ' request bad'
    } else if (code >= 500 && code < 600) {
      return ' server bad'
    } else {
      return ' world has ended'
    }
  }

  return (
    <>
      {responseError ? (
        <Alert className="m-3" variant="danger">
          {responseError}
        </Alert>
      ) : null}

      {statusCode ? (
        <Alert className="m-3" variant="danger">
          {typeOfError(statusCode)}
        </Alert>
      ) : null}
    </>
  )
}

export default ResponseError
