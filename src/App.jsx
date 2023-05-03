import { Route, Routes } from 'react-router-dom';
import './App.css';
import Page from './components/page/Page';
import { useState } from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import Footer from './components/footer/Footer';
import Books from './components/books/Books';
import Book from './components/book/Book';
import Header from './components/header/Header';

function App() {
    const [query, setQuery] = useState('');
    const updateQuery = (newQuery) => {
        setQuery(newQuery);
    };

    return (
        <Container fluid className="d-flex flex-column h-100 p-0 app">
            <Row className="g-0">
                <Col className="px-0">
                    <Header query={setQuery} />
                </Col>
            </Row>
            <Row className="flex-fill g-0">
                <Col className="px-0">
                    <main className="custom-scroll">
                        <Routes>
                            <Route path="/" element={<Books />} />
                            <Route path="/:bookId" element={<Book query={query} />} />
                            <Route path="/:bookId/:pageId" element={<Page />} />
                        </Routes>
                    </main>
                </Col>
            </Row>
            <Row>
                <Col>
                    <footer className="fixed-bottom bg-light">
                        <Footer />
                    </footer>
                </Col>
            </Row>
        </Container>
    );
}

export default App;
