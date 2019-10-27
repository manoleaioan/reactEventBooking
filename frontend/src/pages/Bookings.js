import React, { Component } from 'react';import { STATES } from 'mongoose';

import AuthContext from '../context/auth-context';
import { Form, Button, Container, Row, Col, Alert, Spinner } from 'react-bootstrap'
import BookingList from '../components/Bookings/BookingsList'
import "./Bookings.css"
class BookingsPage extends Component {
  static contextType = AuthContext

  constructor(props) {
    super(props)
    this.state = {
      bookingsLoading: false,
      bookings: [],
    }
  }

  componentDidMount = () => {
    this.fetchBookings();
  }

  fetchBookings = () => {
    this.setState({ bookingsLoading: true })
    const requestBody = {
      query: `
        query {
          bookings {
            _id
            createdAt
            event{
              _id
              title
              date
            }
          }
        }
      `
    };

    const token = this.context.token;

    fetch('http://localhost:3001/graphql', {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + this.context.token
      }
    }).then(res => {
      if (res.status !== 200 && res.status != 201) {
        throw new Error('Failed');
      }
      return res.json();
    }).then(resData => {
      const bookings = resData.data.bookings;
      this.setState({ bookings: bookings, bookingsLoading: false })
    })
    .catch(err => {
      console.log(err);
      this.setState({ bookingsLoading: false })
    });
  }

  deleteBookingHandler = bookingId => {
    this.setState({ bookingsLoading: true })
    const requestBody = {
      query: `
        mutation cancelBooking($id: ID!) {
          cancelBooking(bookingId: $id) {
            _id
            title
          }
        }
      `
      ,
      variables:{
        id:bookingId
      }
    };

    const token = this.context.token;

    fetch('http://localhost:3001/graphql', {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + this.context.token
      }
    }).then(res => {
      if (res.status !== 200 && res.status != 201) {
        throw new Error('Failed');
      }
      return res.json();
    }).then(resData => {
     
      this.setState(prevState => {
        const updatedBookings = prevState.bookings.filter(booking => {
          return booking._id !== bookingId;
        });
        return {bookings:updatedBookings, bookingsLoading: false}
      })
    })
    .catch(err => {
      console.log(err);
      this.setState({ bookingsLoading: false })
    });
  }

  render() {
    return (
      <Container className="BookingPage">
        {this.state.bookingsLoading ?<Spinner animation="border" variant="primary" className="mx-auto d-flex spinner" />
          : 
          <BookingList bookings={this.state.bookings} onDelete={this.deleteBookingHandler} />
        }
      </Container>
    );
  }
}

export default BookingsPage;