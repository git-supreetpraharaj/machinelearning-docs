import React, { useState } from 'react';
import { Button, Container, Form, Nav, Navbar } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { logout } from '../../store/slices/authSlice';
import Login from '../forms/Login';

const Header = ({ updateQuery }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const { user } = useSelector((state) => state.auth);
    const [showLogin, setShowLogin] = useState(false);
    const dispatch = useDispatch();
    const handleOnSubmit = (e) => {
        e.preventDefault();
        updateQuery(searchTerm);
    };

    const handleLoginShow = () => setShowLogin(true);

    const handleSignout = (e) => {
        e.preventDefault();
        dispatch(logout());
    };

    return (
        <Navbar expand="lg" bg="dark" variant="dark">
            <Container fluid>
                <Link className="navbar-brand ms-3" to="/">
                    Machine Learning
                </Link>
                <Navbar.Toggle aria-controls="navbarScroll" />
                <Navbar.Collapse id="navbarScroll">
                    <Form className="d-flex me-auto" onSubmit={handleOnSubmit}>
                        <Button
                            className="me-2"
                            variant="outline-success"
                            type="submit">
                            Search
                        </Button>
                        <Form.Control
                            type="search"
                            placeholder="Search"
                            aria-label="Search"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </Form>
                    <Nav>
                        {user === null ? (
                            <Nav.Link
                                className="me-3"
                                onClick={handleLoginShow}>
                                Sign in
                            </Nav.Link>
                        ) : (
                            <>
                                <Navbar.Text>
                                    Signed in as: {user.email}
                                </Navbar.Text>
                                <Nav.Link
                                    className="me-3"
                                    onClick={handleSignout}>
                                    Sign out
                                </Nav.Link>
                            </>
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Container>
            <Login show={showLogin} setShow={setShowLogin} />
        </Navbar>
    );
};

export default Header;
