import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styles from './Books.module.css';
import AddBook from '../forms/AddBook';
import UpdateBook from '../forms/UpdateBook';
import DeleteBook from '../forms/DeleteBook';
import Spinner from '../spinner/Spinner';
import { fetchBooksAsync } from '../../store/slices/booksSlice';
import { Button, Card } from 'react-bootstrap';
import { BsPlusCircleDotted } from 'react-icons/bs';
import { MdEdit, MdOutlineDelete, MdOutlineOpenInNew } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import { getAgoTime } from '../../utils/utilities';

const Books = () => {
    const dispatch = useDispatch();
    const { books, isLoading, user } = useSelector((state) => ({
        books: state.books.books,
        isLoading: state.books.isLoading,
        user: state.auth.user
    }));
    const [selectedBook, setSelectedBook] = useState(null);
    const [selectedId, setSelectedId] = useState(null);
    const [showAddBook, setShowAddBook] = useState(false);
    const [showUpdateBook, setShowUpdateBook] = useState(false);
    const [showDeleteBook, setShowDeleteBook] = useState(false);
    const navigate = useNavigate();

    const handleAddBookShow = () => setShowAddBook(true);
    const handleUpdateBookShow = () => setShowUpdateBook(true);
    const handleDeleteBookShow = () => setShowDeleteBook(true);

    const handleOpenBook = (bookId) => {
        navigate(`/${bookId}`);
    };

    useEffect(() => {
        dispatch(fetchBooksAsync());
    }, [dispatch]);

    return isLoading ? (
        <Spinner />
    ) : (
        <div className={styles.cardDeck}>
            {Object.keys(books)
                .sort()
                .map((key) => (
                    <Card border="dark" bg="dark" text="white" className={styles.card} key={key}>
                        <Card.Img
                            variant="top"
                            src={books[key].cover ?? 'https://via.placeholder.com/350x150'}
                            className={styles.cardImage}
                        />
                        <Card.Body>
                            <Card.Title>{books[key].name}</Card.Title>
                            <Card.Text className={styles.cardText}>
                                {books[key].shortDesc}
                            </Card.Text>
                        </Card.Body>
                        <Card.Footer className={styles.cardFooter}>
                            <small className="text-muted">
                                Last updated {getAgoTime(books[key].updatedOn)}
                            </small>
                            <Button
                                className={`${styles.footerBtn} ms-auto me-2`}
                                variant="dark"
                                onClick={() => {
                                    handleOpenBook(key);
                                }}>
                                <MdOutlineOpenInNew size={24} />
                            </Button>
                            <Button
                                className={`${styles.footerBtn} me-2`}
                                variant="dark"
                                onClick={() => {
                                    setSelectedId(key);
                                    setSelectedBook(books[key]);
                                    handleUpdateBookShow();
                                }}
                                disabled={!user}>
                                <MdEdit size={24} color={user ? '#24a0ed' : 'white'} />
                            </Button>
                            <Button
                                variant="dark"
                                className={styles.footerBtn}
                                onClick={() => {
                                    setSelectedId(key);
                                    setSelectedBook(books[key]);
                                    handleDeleteBookShow();
                                }}
                                disabled={!user}>
                                <MdOutlineDelete size={24} color={user ? '#c70000' : 'white'} />
                            </Button>
                        </Card.Footer>
                    </Card>
                ))}
            {user && (
                <Card
                    text="white"
                    border="dark"
                    className={styles.cardAdd}
                    onClick={handleAddBookShow}>
                    <Card.Body className={styles.cardAddBody}>
                        <BsPlusCircleDotted size={60} />
                    </Card.Body>
                </Card>
            )}
            <AddBook show={showAddBook} setShow={setShowAddBook} />
            {selectedBook && selectedId && (
                <UpdateBook
                    show={showUpdateBook}
                    setShow={setShowUpdateBook}
                    bookId={selectedId}
                    book={selectedBook}
                    setSelectedId={setSelectedId}
                    setSelectedBook={setSelectedBook}
                />
            )}
            {selectedBook && selectedId && (
                <DeleteBook
                    show={showDeleteBook}
                    setShow={setShowDeleteBook}
                    bookId={selectedId}
                    book={selectedBook}
                    setSelectedId={setSelectedId}
                    setSelectedBook={setSelectedBook}
                />
            )}
        </div>
    );
};

export default Books;
