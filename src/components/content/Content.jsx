import React, { useEffect, useRef, useState } from 'react';
import { runContentGenerator } from './ContentGenerator';
import styles from './Content.module.css';
import { useNavigate } from 'react-router-dom';
import { db } from '../../firebase/FirebaseSetup';
import { collection, getDocs } from 'firebase/firestore';
import { useSelector } from 'react-redux';
import { Button } from 'react-bootstrap';

const Content = ({ query }) => {
    const containerRef = useRef(null);
    const navigate = useNavigate();
    const { user } = useSelector((state) => state.auth);
    const [editable, setEditable] = useState(false);
    const [docNodes, setDocNodes] = useState([]);
    const [docLinks, setDocLinks] = useState([]);

    useEffect(() => {
        let doc_nodes = [];
        let doc_links = [];
        const getData = async () => {
            const nodesQuerySnapshot = await getDocs(collection(db, 'ml-doc-md'));
            const linksQuerySnapshot = await getDocs(collection(db, 'ml-doc-links'));
            nodesQuerySnapshot.forEach((doc) => {
                doc_nodes.push(doc.data());
            });
            linksQuerySnapshot.forEach((doc) => {
                doc_links.push(doc.data());
            });
            setDocNodes(doc_nodes);
            setDocLinks(doc_links[0].links);
        };
        getData();
    }, [user, query]);

    useEffect(() => {
        let simulationObj;
        let svgObj;
        if (containerRef.current) {
            const { svg, simulation } = runContentGenerator(
                containerRef.current,
                docLinks,
                docNodes,
                setDocLinks,
                navigate,
                user,
                editable
            );
            simulationObj = simulation;
            svgObj = svg;
        }
        return () => {
            simulationObj.stop();
            svgObj.remove();
        };
    }, [editable, docNodes, docLinks]);

    const handleEdit = () => {
        setEditable(!editable);
    };

    return (
        <div>
            <div ref={containerRef} className={styles.content} />
            {user && (
                <div className={styles.editMenu}>
                    <Button size="sm" variant="secondary" className="me-3" onClick={handleEdit}>
                        {editable ? 'Save' : 'Edit'}
                    </Button>
                    <Button size="sm" variant="secondary">
                        Add Document
                    </Button>
                </div>
            )}
        </div>
    );
};

export default Content;
