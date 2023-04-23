import { Container, Row } from 'react-bootstrap';
import Header from '../header/Header';
import Footer from '../footer/Footer';
import styles from './MainContainer.module.css';
import { Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Spinner from '../spinner/Spinner';

const MainContainer = ({ updateQuery }) => {
    const { loading } = useSelector((state) => state.auth);

    return (
        <>
            <Row>
                <Header updateQuery={updateQuery} />
            </Row>
            <Row className={styles.main}>{loading ? <Spinner /> : <Outlet />}</Row>
        </>
    );
};

export default MainContainer;
