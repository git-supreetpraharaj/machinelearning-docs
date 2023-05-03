import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import {
    fetchPagesAsync,
    resetPages,
    responseFailure
} from '../../store/slices/pagesSlice';
import { updateBookAsync } from '../../store/slices/booksSlice';
import { Button } from 'react-bootstrap';
import AddPage from '../forms/AddPage';
import UpdatePage from '../forms/UpdatePage';
import DeletePage from '../forms/DeletePage';
import styles from './Book.module.css';
import 'react-tooltip/dist/react-tooltip.css';
import { Tooltip } from 'react-tooltip';

import { runBookNetGenerator } from '../../svgGenerator/bookNetGenerator';
import Spinner from '../spinner/Spinner';

const Book = ({ query }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const svgContainerRef = useRef(null);
    const { bookId } = useParams();
    const { pages, books, user } = useSelector((state) => {
        return {
            pages: state.pages.pages,
            books: state.books.books,
            user: state.auth.user
        };
    });
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
    const [nodes, setNodes] = useState([]);
    const [links, setLinks] = useState([]);
    const [isEdit, setEdit] = useState(false);

    const [selectedPage, setSelectedPage] = useState(null);
    const [selectedId, setSelectedId] = useState(null);
    const [isLoading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showAddPage, setShowAddPage] = useState(false);
    const [showUpdatePage, setShowUpdatePage] = useState(false);
    const [showDeleteBook, setShowDeleteBook] = useState(false);
    console.log('1', isLoading, nodes, links);
    useEffect(() => {
        console.log('3 use1', isLoading, nodes, links);
        setLoading(true);
        dispatch(fetchPagesAsync(bookId)).then((result) => {
            if (result.type === responseFailure.type) {
                setError(result.payload);
                setLoading(false);
            } else {
                setNodes(result.payload);
                setLinks(books[bookId].links);
                setLoading(false);
            }
        });

        return () => {
            dispatch(resetPages);
            setNodes([]);
            setLinks([]);
        };
    }, [user, bookId, dispatch]);

    useEffect(() => {
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    useEffect(() => {
        // setLoading(true);
        setNodes(pages);
        setLinks(books[bookId].links);
        // setLoading(false);
        return () => {
            setNodes([]);
            setLinks([]);
        };
    }, [user, pages]);

    useEffect(() => {
        // setLoading(true);
        let svgGenerator;
        if (svgContainerRef.current && !isLoading) {
            const data = {
                nodes: nodes,
                links: links
            };
            svgGenerator = runBookNetGenerator({
                svgContainerRef,
                data,
                styles,
                isEdit,
                setLinks,
                saveNewLink,
                setEdit,
                setSelectedPage,
                setSelectedId,
                handleAddPageShow,
                handleUpdateBookShow,
                handleDeleteBookShow,
                navigate,
                user,
                handleRefreshPages
            });
        }
        // setLoading(false);
        return () => {
            if (svgContainerRef.current && !isLoading) {
                svgGenerator.simulation.stop();
                svgGenerator.svg.remove();
            }
        };
    }, [user, isEdit, nodes, links, dimensions.width, dimensions.height]);

    function handleResize() {
        setDimensions({
            width: window.innerWidth,
            height: window.innerHeight
        });
    }

    const handleAddPageShow = () => {
        setShowAddPage(true);
    };
    const handleUpdateBookShow = () => setShowUpdatePage(true);
    const handleDeleteBookShow = () => setShowDeleteBook(true);
    const handleRefreshPages = () => {
        setLoading(true);
        dispatch(fetchPagesAsync(bookId)).then((result) => {
            if (result.type === responseFailure.type) {
                setError(result.payload);
            } else {
                setNodes(result.payload);
                setLinks(books[bookId].links);
                setLoading(false);
            }
        });
    };

    const saveNewLink = (newLinks) => {
        dispatch(updateBookAsync(bookId, newLinks)).then((res) => {
            console.log(res.payload);
        });
    };

    return isLoading ? (
        <Spinner />
    ) : (
        <div ref={svgContainerRef} className={styles.svgContainer}>
            <Tooltip id="my-tooltip" className={styles.tooltip} />
            <AddPage
                show={showAddPage}
                setShow={setShowAddPage}
                bookId={bookId}
            />
            {selectedId && selectedPage && (
                <UpdatePage
                    show={showUpdatePage}
                    setShow={setShowUpdatePage}
                    bookId={bookId}
                    pageId={selectedId}
                    page={selectedPage}
                    setSelectedId={setSelectedId}
                    setSelectedPage={setSelectedPage}
                />
            )}
            {selectedId && selectedPage && (
                <DeletePage
                    show={showDeleteBook}
                    setShow={setShowUpdatePage}
                    bookId={bookId}
                    pageId={selectedId}
                    page={selectedPage}
                    setSelectedId={setSelectedId}
                    setSelectedPage={setSelectedPage}
                />
            )}
        </div>
    );
};

export default Book;
