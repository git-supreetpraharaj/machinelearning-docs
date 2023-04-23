import React, { useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import { Formik } from 'formik';
import * as Yup from 'yup';
import FormContainer from '../container/FormContainer';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../../store/slices/authSlice';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const dispatch = useDispatch();
    const { loading, error, user } = useSelector((state) => state.auth);
    const navigate = useNavigate();
    const validationSchema = Yup.object().shape({
        email: Yup.string().email('Invalid email').required('Email is required'),
        password: Yup.string().required('Password is required')
    });

    const handleSubmit = (values) => {
        dispatch(login(values.email, values.password));
        if (user !== null) navigate('/');
    };

    return (
        <FormContainer>
            <Formik
                initialValues={{ email: '', password: '' }}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}>
                {({ handleSubmit, handleChange, values, errors }) => (
                    <Form noValidate onSubmit={handleSubmit}>
                        <Form.Group controlId="formBasicEmail" className="mt-3">
                            <Form.Label>Email address</Form.Label>
                            <Form.Control
                                type="email"
                                name="email"
                                value={values.email}
                                onChange={handleChange}
                                isInvalid={!!errors.email}
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.email}
                            </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group controlId="formBasicPassword" className="mt-3">
                            <Form.Label>Password</Form.Label>
                            <Form.Control
                                type="password"
                                name="password"
                                value={values.password}
                                onChange={handleChange}
                                isInvalid={!!errors.password}
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.password}
                            </Form.Control.Feedback>
                        </Form.Group>
                        <div className="d-flex justify-content-center mt-3">
                            <Button variant="primary" type="submit">
                                {loading ? 'Loading...' : 'Log in'}
                            </Button>
                        </div>
                        {error && (
                            <div className="d-flex justify-content-center mt-3 text-danger">
                                <span>{error}</span>
                            </div>
                        )}
                    </Form>
                )}
            </Formik>
        </FormContainer>
    );
};

export default Login;
