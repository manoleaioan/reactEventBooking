import React, { Component } from 'react';
import './EventItem.css';
import { Button, Container, Row, Col, Card } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlusCircle } from '@fortawesome/free-solid-svg-icons'

const eventItem = props => (
  <Card className="eventItm mx-auto">
    <Card.Body>
      <Card.Title>{props.title}</Card.Title>

      <Row>
        <Col>
          <h6 className="text-muted">
            {props.price}$
          </h6>
        </Col>

        <Col className="right">
          {
            props.authUserId === props.creator._id 
              ?<p>You're the owner of this event</p>
              :<Button onClick={() => props.onDetails(props._id)}>View Details</Button>
          }
        </Col>
      </Row>
      
    </Card.Body>
    <Card.Footer>
      <small className="text-muted">Event Date {new Date(props.date).toLocaleDateString()}</small>
    </Card.Footer>
  </Card>
);

export default eventItem