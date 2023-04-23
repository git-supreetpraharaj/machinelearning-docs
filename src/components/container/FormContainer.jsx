import React from 'react';
import { Col, Container, Row } from 'react-bootstrap';

const FormContainer = ({ children }) => {
    return (
        <Container>
            <Row className="h-75   align-items-center justify-content-center">
                <Col xs={12} md={6}>
                    {children}
                </Col>
            </Row>
        </Container>
    );
};

export default FormContainer;
