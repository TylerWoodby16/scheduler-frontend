import React from 'react'
import Alert from 'react-bootstrap/Alert'

interface Props {
  responseError: string | undefined
}

const ResponseError: React.FC<Props> = ({ responseError }) => {
  return (
    <>
      {responseError ? (
        <Alert className="m-3" variant="danger">
          {responseError}
        </Alert>
      ) : null}
    </>
  )
}

export default ResponseError
