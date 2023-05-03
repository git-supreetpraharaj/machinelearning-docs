import React, { useState } from 'react';
import {
    deletePageAsync,
    responseFailure
} from '../../store/slices/pagesSlice';
import { Button, Modal, Spinner } from 'react-bootstrap';
import { useDispatch } from 'react-redux';

const DeletePage = ({
    show,
    setShow,
    bookId,
    pageId,
    page,
    setSelectedId,
    setSelectedPage
}) => {
    const dispatch = useDispatch();
    const [isLoading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleClose = () => {
        setLoading(false);
        setError('');
        setSelectedPage(null);
        setSelectedId(null);
        setShow(false);
    };

    const handleConfirm = () => {
        setLoading(true);

        dispatch(deletePageAsync(bookId, pageId))
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
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Comfirm Delete</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                Are you sure you want to delete {page.name}?
            </Modal.Body>
            <Modal.Footer className="justify-content-center">
                <div className="mx-2">
                    <Button variant="secondary" onClick={handleClose}>
                        Cancel
                    </Button>
                </div>
                <div className="mx-2">
                    <Button
                        variant="danger"
                        onClick={() => {
                            handleConfirm();
                        }}>
                        {isLoading ? (
                            <Spinner animation="border" size="sm" />
                        ) : (
                            'Delete'
                        )}
                    </Button>
                </div>
            </Modal.Footer>
        </Modal>
    );
};

export default DeletePage;
