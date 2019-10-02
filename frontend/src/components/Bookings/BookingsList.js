import React from 'react';
import { Form, Button, Container, Row, Col, Alert, Spinner, Card} from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes } from '@fortawesome/free-solid-svg-icons'
import "./BookingList.css"

const bookingList = props => (
  <div className="bookingList">
    {
      props.bookings.map(booking => {
        return(
          <Card className="bookingItm mx-auto" key={booking._id}>
            <Card.Body>
              <Row>
                <Col>
                  {booking.event.title} - {new Date(booking.createdAt).toLocaleDateString()}
                  <Button variant="primary" className="btn block d-block mb-4 addEvent" onClick={() => props.onDelete(booking._id)}>
                    <FontAwesomeIcon icon={faTimes} /> Cancel
                  </Button>
                </Col>
              </Row>
            </Card.Body>
          </Card>
          )
        }
      )
    }
  </div>
);

export default bookingList;