import React, { Component } from 'react';
import "./Events.css"
import { Form, Button, Container, Row, Col, Alert, Spinner } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlusCircle } from '@fortawesome/free-solid-svg-icons'
import Modal from '../components/Modal/Modal';
import AuthContext from '../context/auth-context';
import EventList from '../components/Events/EventList'

class EventsPage extends Component {
  static contextType = AuthContext
  isActive = true 

  constructor(props) {
    super(props)
    this.state = {
      showModal: false,
      events: [],
      selectedEvent: null,
      eventsLoading: false
    }
    this.titleElRef = React.createRef();
    this.priceElRef = React.createRef();
    this.dateElRef = React.createRef();
    this.descriptionElRef = React.createRef();
  }

  componentDidMount = () => {
    this.fetchEvents();
  }

  componentWillUnmount = () => {
    this.isActive = false;
  }

  modalOpenHandler = () => {
    this.setState({ showModal: true })
  }

  modalCancelHandler = () => {
    this.setState({ showModal: false, selectedEvent: null })
  }

  modalConfirmHandler = () => {
    const title = this.titleElRef.current.value;
    const price = +this.priceElRef.current.value;
    const date = this.dateElRef.current.value;
    const description = this.descriptionElRef.current.value;

    if (title.trim().length == 0 || price <= 0 || date.trim().length == 0 || description.trim().length == 0) {
      return
    }

    const event = { title, price, date, description };
    console.log(event);

    const requestBody = {
      query: `
        mutation CreateEvent($title: String!, $desc: String!, $price: Float!, $date: String!){
          createEvent(eventInput: {title: $title, description: $desc", price: $price, date: $date}) {
            _id
            title
            description
            date
            price
          }
        }
      `,
      variables:{
        title: title,
        desc: description,
        price: price,
        date: date
      }
    };

    const token = this.context.token;

    fetch('http://localhost:3001/graphql', {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      }
    }).then(res => {
      if (res.status !== 200 && res.status != 201) {
        throw new Error('Failed');
      }
      return res.json();
    }).then(resData => {
      this.modalCancelHandler();
      this.setState(prevState => {
        const updatedEvents = [...prevState.events];
        updatedEvents.push({
          _id: resData.data.createEvent._id,
          title: resData.data.createEvent.title,
          description: resData.data.createEvent.description,
          date: resData.data.createEvent.date,
          price: resData.data.createEvent.price,
          creator: {
            _id: this.context.userId
          }
        });
        return { events: updatedEvents };
      })
    })
      .catch(err => {
        console.log(err);
      });

  }

  bookEventHandler = () => {
    if(!this.context.token){
      this.setState({selectedEvent: null});
      return;
    }
    const requestBody = {
      query: `
        mutation BookEvent($id: ID!){
          bookEvent(eventId: $id) {
            _id
            createdAt
            updatedAt
          }
        }
      `,
      variables: {
        id: this.state.selectedEvent._id
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
      console.log(resData);
      this.setState({selectedEvent: null});
    })
      .catch(err => {
        console.log(err);
      });
  }

  fetchEvents = () => {
    this.setState({ eventsLoading: true })
    const requestBody = {
      query: `
        query {
          events {
            _id
            title
            description
            date
            price
            creator {
              _id
              email
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
        'Content-Type': 'application/json'
      }
    }).then(res => {
      if (res.status !== 200 && res.status != 201) {
        throw new Error('Failed');
      }
      return res.json();
    }).then(resData => {
      const events = resData.data.events;
      if(this.isActive){
        this.setState({ events: events, eventsLoading: false })
      }
    })
      .catch(err => {
        console.log(err);
        if(this.isActive){
          this.setState({ eventsLoading: false })
        }
      });
  }

  showDetailHandler = (eventId) => {
    this.setState(prevState => {
      const selectedEvent = prevState.events.find(e => e._id === eventId);
      return { selectedEvent: selectedEvent };
    })
  }

  render() {
    return (
      <Container className="EventsPage">
        {this.context.token && <Button variant="primary" className="btn block d-block mb-4 mx-auto addEvent" onClick={this.modalOpenHandler} >
          <FontAwesomeIcon icon={faPlusCircle} /> Add Event
        </Button>}
        <Modal
          title="Add Event"
          show={this.state.showModal}
          canCancel
          canConfirm
          onCancel={this.modalCancelHandler}
          onConfirm={this.modalConfirmHandler}
          confirmText="Confirm"
        >
          <Form>
            <Form.Group controlId="formTitle">
              <Form.Label>Title</Form.Label>
              <Form.Control type="text" placeholder="Enter the title" ref={this.titleElRef} />
            </Form.Group>
            <Form.Group controlId="formPrice">
              <Form.Label>Price</Form.Label>
              <Form.Control type="number" placeholder="Enter the price" ref={this.priceElRef} />
            </Form.Group>
            <Form.Group controlId="formDate">
              <Form.Label>Date</Form.Label>
              <Form.Control type="datetime-local" placeholder="Enter the date" ref={this.dateElRef} />
            </Form.Group>
            <Form.Group controlId="formDescription">
              <Form.Label>Description</Form.Label>
              <Form.Control as="textarea" rows="4" ref={this.descriptionElRef} />
            </Form.Group>
          </Form>
        </Modal>

        {this.state.selectedEvent && <Modal
          title={this.state.selectedEvent.title}
          show={this.state.selectedEvent?true:false}
          canCancel
          canConfirm
          onCancel={this.modalCancelHandler}
          onConfirm={this.bookEventHandler}
          confirmText={this.context.token ? "Book" : "Confirm"}
        >
          <h3>{this.state.selectedEvent.description}</h3>
          <h4>${this.state.selectedEvent.price} -  {new Date(this.state.selectedEvent.date).toLocaleDateString()}</h4>
        </Modal>}

        {this.state.eventsLoading && <Spinner animation="border" variant="primary" className="mx-auto d-flex" />}

        <EventList events={this.state.events} authUserId={this.context.userId} onViewDetails={this.showDetailHandler} />
      </Container>
    );
  }
}

export default EventsPage;