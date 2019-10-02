
import React from 'react';
// import { NavLink } from 'react-router-dom';
import { Navbar, Nav, NavDropdown, Dropdown } from 'react-bootstrap'
import { LinkContainer, } from 'react-router-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCalendar } from '@fortawesome/free-solid-svg-icons'
import "./MainNavigation.css"
import AuthContext from '../../context/auth-context';

const mainNavigation = props => (
  <AuthContext.Consumer>
    {
      (context) => {
        return (
          <Navbar collapseOnSelect expand="sm" bg="darkv2" variant="dark" className="mainNav">

            <Navbar.Toggle aria-controls="responsive-navbar-nav" />
            <Navbar.Brand className="d-flex w-30 order-0">
              <LinkContainer to="/">
                <span className="nav-link">Brand</span>
              </LinkContainer>
            </Navbar.Brand>
            <Navbar.Collapse id="responsive-navbar-nav" className="justify-content: center">
              <Nav className="mx-auto">

                {!context.token && (
                  <LinkContainer to="/auth">
                    <span className="nav-link">Authenticate</span>
                  </LinkContainer>
                )}

                <LinkContainer to="/events">
                  <span className="nav-link">Events</span>
                </LinkContainer>

                {context.token && (
                  <LinkContainer to="/bookings">
                    <span className="nav-link">Bookings</span>
                  </LinkContainer>
                )}
              </Nav>
              {context.token && (
                <Nav className="profileNav">
                <Dropdown.Divider />
                  {/* <LinkContainer to="/profile">
                    <span className="nav-link">User</span>
                  </LinkContainer> */}

                  <NavDropdown title="UserName">
                    <NavDropdown.Item href="#action/3.1">Profile</NavDropdown.Item>
                    <NavDropdown.Item href="#action/3.2">Another action</NavDropdown.Item>
                    <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
                    <NavDropdown.Divider />
                    <NavDropdown.Item onClick={context.logout}>LogOut</NavDropdown.Item>
                  </NavDropdown>

                </Nav>
              )}
            </Navbar.Collapse>
          </Navbar>
        )
      }
    }
  </AuthContext.Consumer>
)

export default mainNavigation;