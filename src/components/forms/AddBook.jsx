import React, { useState } from 'react';
import { Button, Form, Modal, Image, Spinner, Alert } from 'react-bootstrap';
import noPreviewImage from '../../assets/No Preview New.png';
import styles from './Form.module.css';
import * as Yup from 'yup';
import { useDispatch } from 'react-redux';
import { addBookAsync, responseFailure } from '../../store/slices/booksSlice';
import { Field, Formik } from 'formik';

const AddBook = ({ show, setShow }) => {
    const dispatch = useDispatch();
    const [error, setError] = useState('');

    const handleClose = () => {
        setError('');
        setShow(false);
    };

    const handleSubmit = (values, { setSubmitting }) => {
        const book = {
            name: values.name,
            shortDesc: values.shortDesc,
            image: values.image
        };

        dispatch(addBookAsync(book))
            .then((result) => {
                if (result.type === responseFailure.type) {
                    setError(result.payload);
                } else {
                    handleClose();
                }
            })
            .finally(() => {
                setSubmitting(false);
            });
    };

    const handleFileInputChange = (event, setFieldValue) => {
        const file = event.target.files[0];
        setFieldValue('image', file);
    };

    const validationSchema = Yup.object().shape({
        name: Yup.string()
            .min(5, 'Name must be at least 5 characters')
            .matches(
                /^[\w\s'"-]+$/,
                'Name can only contain letters, numbers, underscores, hyphens, single quotes, double quotes and spaces'
            )
            .required('Name is required'),
        description: Yup.string().notRequired(),
        image: Yup.mixed().notRequired()
    });

    const initialValues = {
        name: '',
        shortDesc: '',
        image: null
    };

    return (
        <Modal show={show} onHide={handleClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>Add New Book</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Formik
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}>
                    {({
                        handleSubmit,
                        handleChange,
                        touched,
                        values,
                        errors,
                        setFieldValue,
                        isSubmitting
                    }) => (
                        <Form
                            noValidate
                            onSubmit={handleSubmit}>
                            <Form.Group
                                className="mb-3"
                                controlId="newPageForm.pageName">
                                <Form.Label>Book Name</Form.Label>
                                <Form.Control
                                    as={Field}
                                    type="text"
                                    name="name"
                                    value={values.name}
                                    onChange={handleChange}
                                    placeholder="Enter Book Name"
                                    isInvalid={errors.name && touched.name}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors.name && touched.name && errors.name}
                                </Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group
                                className="mb-3"
                                controlId="newPageForm.shortDesc">
                                <Form.Label>Description</Form.Label>
                                <Form.Control
                                    as={Field}
                                    component="textarea"
                                    name="shortDesc"
                                    value={values.shortDesc}
                                    onChange={handleChange}
                                    placeholder="Enter Short Description"
                                    isInvalid={
                                        errors.shortDesc && touched.shortDesc
                                    }
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors.shortDesc &&
                                        touched.shortDesc &&
                                        errors.shortDesc}
                                </Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group controlId="newBookForm.image">
                                <Form.Label>Upload a cover image</Form.Label>
                                <Form.Control
                                    type="file"
                                    name="image"
                                    accept="image/*"
                                    onChange={(e) => {
                                        handleFileInputChange(e, setFieldValue);
                                    }}
                                    isInvalid={errors.image && touched.image}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors.image &&
                                        touched.image &&
                                        errors.image}
                                </Form.Control.Feedback>
                            </Form.Group>
                            <div className={styles.preview}>
                                Preview Cover Image
                                <Image
                                    src={
                                        values.image
                                            ? URL.createObjectURL(values.image)
                                            : noPreviewImage
                                    }
                                    alt={
                                        values.image
                                            ? values.image.name
                                            : 'No Image'
                                    }
                                    className={styles.previewImage}
                                />
                            </div>

                            <Modal.Footer className="d-flex justify-content-center flex-column">
                                <Button
                                    variant="primary"
                                    type="submit"
                                    onClick={handleSubmit}
                                    disabled={isSubmitting}>
                                    {isSubmitting ? (
                                        <Spinner animation="border" size="sm" />
                                    ) : (
                                        'Add'
                                    )}
                                </Button>
                                {error && (
                                    <Alert variant="danger">{error}</Alert>
                                )}
                            </Modal.Footer>
                        </Form>
                    )}
                </Formik>
            </Modal.Body>
        </Modal>
    );
};

export default AddBook;
