import React from "react";
import axios from "axios";
import "./App.css";
import { useState, useEffect } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
// Home.jsx

type Aircraft = {
  name: string;
  id: number;
  year: number;
};

const Home: React.FC = () => {
  const [aircrafts, setAircrafts] = useState<Aircraft[]>([]);
  const getAircrafts = async () => {
    // We get an object that looks like {data:}
    const headers = {
      "x-access-token" : localStorage.getItem("token")
    };

    const { data } = await axios.get<Aircraft[]>(
      `http://localhost:5000/aircrafts`, { headers }
    );
    setAircrafts(data);
  };

  useEffect(() => {
    getAircrafts();
  }, []);

  return (
    <Container className="text-center h6">
      <Row>
        <Col>
          {aircrafts.map((aircraft, index) => {
            return (
              <div key={index}>
                {aircraft.name} {aircraft.year}
              </div>
            );
          })}
        </Col>
      </Row>
    </Container>
  );
};

export default Home;
