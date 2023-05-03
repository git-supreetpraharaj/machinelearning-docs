import React, { useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import {
    responseFailure,
    updatePageAsync
} from '../../store/slices/pagesSlice';
import { Alert, Button, Form, Modal, Spinner } from 'react-bootstrap';

const UpdatePage = ({
    show,
    setShow,
    bookId,
    pageId,
    page,
    setSelectedId,
    setSelectedPage
}) => {
    const dispatch = useDispatch();
    const formRef = useRef(null);
    const [isLoading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [name, setName] = useState(page.name);
    const [shortDesc, setShortDesc] = useState(page.shortDesc);

    const handleClose = () => {
        setLoading(false);
        setError('');
        setSelectedPage(null);
        setSelectedId(null);
        setShow(false);
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        setLoading(true);
        const formData = new FormData(formRef.current);
        const pageName = formData.get('name');
        const shortDesc = formData.get('shortDesc');

        const updatePage = {
            name: pageName,
            shortDesc: shortDesc
        };

        dispatch(updatePageAsync(bookId, pageId, updatePage))
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
                <Modal.Title>
                    Update Page <strong>{page.name}</strong>
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form ref={formRef} onSubmit={handleSubmit}>
                    <Form.Group
                        className="mb-3"
                        controlId="updatePageForm.pageName">
                        <Form.Label>Name</Form.Label>
                        <Form.Control
                            type="text"
                            name="name"
                            placeholder="Enter Page Name"
                            value={name}
                            onChange={(e) => {
                                setName(e.target.value);
                            }}
                        />
                    </Form.Group>

                    <Form.Group
                        className="mb-3"
                        controlId="updatePageForm.shortDesc">
                        <Form.Label>Short Description</Form.Label>
                        <Form.Control
                            as="textarea"
                            name="shortDesc"
                            row={3}
                            placeholder="Enter Short Description"
                            value={shortDesc}
                            onChange={(e) => {
                                setShortDesc(e.target.value);
                            }}
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
                            'Update'
                        )}
                    </Button>
                    {error && <Alert variant="danger">{error}</Alert>}
                </Modal.Footer>
            </Modal.Body>
        </Modal>
    );
};

export default UpdatePage;
