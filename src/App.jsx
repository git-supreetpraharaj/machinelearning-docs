import { Outlet, Route, Routes } from 'react-router-dom';
import './App.css';
import MainContainer from './components/container/MainContainer';
import Content from './components/content/Content';
import Login from './components/page/Login';
import Page from './components/page/Page';
import { useState } from 'react';
import { Container, Row } from 'react-bootstrap';
import Footer from './components/footer/Footer';

function App() {
    const [query, setQuery] = useState('');
    const updateQuery = (newQuery) => {
        setQuery(newQuery);
    };

    return (
        <Container fluid>
            <Routes>
                <Route path="/" element={<MainContainer updateQuery={updateQuery} />}>
                    <Route path="/" element={<Content query={query} />} />
                    <Route path="/page/:pageName" element={<Page />} />
                </Route>
                <Route path="/login" element={<Login />} />
            </Routes>
            <Row className="footerSection fixed-bottom">
                <Footer />
            </Row>
        </Container>
    );
}

export default App;
