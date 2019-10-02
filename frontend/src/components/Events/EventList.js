import React, { Component } from 'react';
import EventItem from './EventItem/EventItem'

const eventList = props => {
  const events = props.events.map(event => {
    return (
      <EventItem 
        key={event._id} 
        {...event} 
        authUserId={props.authUserId}
        onDetails={props.onViewDetails}
      />
    );
  });

  return (<div>{events}</div>)
};

export default eventList;