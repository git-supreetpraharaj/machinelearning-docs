import React, { useState } from 'react';
import { Button, Container, Form, Nav, Navbar } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { logout } from '../../store/slices/authSlice';

const Header = ({ updateQuery }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const { user } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const handleOnSubmit = (e) => {
        e.preventDefault();
        updateQuery(searchTerm);
    };

    const handleSignout = (e) => {
        e.preventDefault();
        dispatch(logout());
        navigate('/');
    };
    return (
        <Navbar expand="lg" bg="dark" variant="dark">
            <Container fluid>
                <Link className="navbar-brand" to="/">
                    Machine Learning
                </Link>
                <Navbar.Toggle aria-controls="navbarScroll" />
                <Navbar.Collapse id="navbarScroll">
                    <Form className="d-flex me-auto" onSubmit={handleOnSubmit}>
                        <Button className="me-2" variant="outline-success" type="submit">
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
                            <Link className="nav-link" to="/login">
                                Sign in
                            </Link>
                        ) : (
                            <>
                                <Navbar.Text>Signed in as: {user.email}</Navbar.Text>
                                <Nav.Link onClick={handleSignout}>Sign out</Nav.Link>
                            </>
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default Header;
