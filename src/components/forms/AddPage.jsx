import React, { useRef, useState } from 'react';
import { Button, Form, Modal, Spinner, Alert } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { addPageAsync, responseFailure } from '../../store/slices/pagesSlice';

const AddPage = ({ show, setShow, bookId }) => {
    const dispatch = useDispatch();
    const formRef = useRef(null);
    const [isLoading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const handleClose = () => {
        setLoading(false);
        setError('');
        setShow(false);
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        setLoading(true);
        const formData = new FormData(formRef.current);
        const pageName = formData.get('name');
        const shortDesc = formData.get('shortDesc');

        const page = {
            name: pageName,
            shortDesc: shortDesc
        };

        dispatch(addPageAsync(bookId, page))
            .then((result) => {
                if (result.type === responseFailure.type) {
                    setError(result.payload);
                } else {
                    handleClose();
                }
            })
            .finally(() => {
                setLoading(false);
            });
    };

    return (
        <Modal show={show} onHide={handleClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>Create New Page</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form ref={formRef} onSubmit={handleSubmit}>
                    <Form.Group
                        className="mb-3"
                        controlId="newPageForm.pageName">
                        <Form.Label>Name</Form.Label>
                        <Form.Control
                            type="text"
                            name="name"
                            placeholder="Enter Page Name"
                        />
                    </Form.Group>

                    <Form.Group
                        className="mb-3"
                        controlId="newPageForm.shortDesc">
                        <Form.Label>Short Description</Form.Label>
                        <Form.Control
                            as="textarea"
                            name="shortDesc"
                            row={5}
                            style={{ height: '100px' }}
                            placeholder="Enter Short Description"
                        />
                    </Form.Group>
                </Form>
                <Modal.Footer className="d-flex justify-content-center flex-column">
                    <Button
                        variant="primary"
                        type="submit"
                        onClick={handleSubmit}
                        disabled={isLoading}>
                        {isLoading ? (
                            <Spinner animation="border" size="sm" />
                        ) : (
                            'Create'
                        )}
                    </Button>
                    {error && <Alert variant="danger">{error}</Alert>}
                </Modal.Footer>
            </Modal.Body>
        </Modal>
    );
};

export default AddPage;
