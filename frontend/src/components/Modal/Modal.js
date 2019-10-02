import React from 'react';
import { Form, Button, Row, Alert, Modal } from 'react-bootstrap'

const modal = props => (
  <Modal show={props.show} onHide={props.onCancel} size="md" aria-labelledby="contained-modal-title-vcenter" centered>

    <Modal.Header closeButton>
      <Modal.Title id="contained-modal-title-vcenter">
        {props.title}
      </Modal.Title>
    </Modal.Header>

    <Modal.Body>
      {props.children}
    </Modal.Body>

    <Modal.Footer>
      {props.canCancel && <Button onClick={props.onCancel}>Cancel</Button>}
      {props.canConfirm &&<Button onClick={props.onConfirm}>{props.confirmText}</Button>}
    </Modal.Footer>
    
  </Modal>
);

export default modal;