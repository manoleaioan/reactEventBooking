import React, { Component, createReft, useState } from 'react';
import "./Auth.css"
import { Form, Button, Container, Row, Col , Alert} from 'react-bootstrap'
import AuthContext from '../context/auth-context';


class AuthPage extends Component {
  constructor(props){
    super(props)
    this.state = {
      err: '',
      isLogin: true
    }
    this.emailEl = React.createRef();
    this.passwordEl = React.createRef();
    this.confPasswordEl = React.createRef();
  }

  static contextType = AuthContext;

  submitHandler = (e) => {
    e.preventDefault();
    const email = this.emailEl.current.value;
    const password = this.passwordEl.current.value;

    if(email=="" || password==""){
      this.setState({err:"All fields required!"});
      return
    }else{
      this.setState({err:""});
    }

    if(!this.state.isLogin){
      const confPassword = this.confPasswordEl.current.value;

      if(password != confPassword){
        this.setState({err:"Password confirmation and Password doesn't match"})
      }
    }

    let requestBody = {
      query: `
        query Login($email: String!, $password: String!){
          login(email: $email, password: $password) {
            userId
            token
            tokenExpiration
          }
        }
      `,
      variables:{
        email: email,
        password: password
      }
    };

    if(!this.state.isLogin){
       requestBody = {
        query: `
          mutation CreateUser($email: String!, $password: String!){
            createUser(userInput: {email: $email, password: $password}) {
              _id,
              email
            }
          }
      `,
      variables:{
        email: email,
        password: password
      }
      };
    }

    fetch('http://localhost:3001/graphql', {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(res => {
      if(res.status !== 200 && res.status != 201){
        if(this.state.isLogin){
          this.setState({err:"You have entered an invalid username or password"})
          return;
        }
      }
      return res.json();
    }).then(resData => {
      if(resData && resData.data.login.token){
        this.context.login(
          resData.data.login.token, 
          resData.data.login.userId, 
          resData.data.login.tokenExpiration
        );
      }
    })
    .catch(err => {
      if(err == "TypeError: Failed to fetch")
        this.setState({err:"Connection error"})
    });
  }
  
  AlertNotif = () => {
    const {err} = this.state
    if (err != '') {
      return (
        <Alert className="errAlert" variant="danger" onClose={() => this.setState({err: ''})} dismissible>
          <p>{err}</p>
        </Alert>
      );
    }
    return ""
  }

  switchModeHandler = () => {
    this.setState( prev => {
     return {
       isLogin: !prev.isLogin,
       err:""
     }
    })
  }

  render() {
    return (
      <Container className="authContent">
        <Row className="justify-content-center">
          <Col xs={9} sm={9} md={7} lg={5} xl={4} >
          {this.AlertNotif()}
          </Col>
        </Row>
        <Row className="justify-content-center">
          <Col xs={9} sm={9} md={7} lg={5} xl={4} >
            <Form autoComplete="off" onSubmit={this.submitHandler}>
              <Form.Group controlId="formBasicEmail">
                <Form.Label>Email address</Form.Label>
                <Form.Control type="email" placeholder="Enter email" ref={this.emailEl} />
                {!this.state.isLogin &&<Form.Text className="text-muted">
                  We'll never share your email with anyone else.
                </Form.Text>}
              </Form.Group>

              <Form.Group controlId="formBasicPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control type="password" placeholder="Password" ref={this.passwordEl} />
              </Form.Group>

              {!this.state.isLogin && <Form.Group controlId="formBasicPassword">
                <Form.Label>Password Confirmation</Form.Label>
                <Form.Control type="password" placeholder="Password" ref={this.confPasswordEl} />
              </Form.Group>}


              <div className="d-flex justify-content-between align-items-center">
                  <span className="switch" onClick={() => this.switchModeHandler()}>Switch to <b>{this.state.isLogin ? "Register" : "Login"}</b></span>
                <Button variant="primary" type="submit" className="btn">
                  {this.state.isLogin ? "Login" : "Register"}
                </Button>    
              </div>

            </Form>
          </Col>
        </Row>
      </Container>
    );
  }
}

export default AuthPage;