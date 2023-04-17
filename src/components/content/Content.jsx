import React, { useEffect, useRef, useState } from "react";
import { runContentGenerator } from "./ContentGenerator";
import styles from "./content.module.css";
import { useNavigate } from "react-router-dom";
import { db } from "../../firebase/FirebaseSetup";
import { collection, getDocs } from "firebase/firestore";

const Content = ({ query }) => {
  const containerRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    let destroyFn;
    let doc_nodes = [];
    let doc_links = [];
    const getData = async () => {
      const nodesQuerySnapshot = await getDocs(collection(db, "ml-doc-md"));
      const linksQuerySnapshot = await getDocs(collection(db, "ml-doc-links"));
      nodesQuerySnapshot.forEach((doc) => {
        doc_nodes.push(doc.data());
      });
      linksQuerySnapshot.forEach((doc) => {
        doc_links.push(doc.data());
      });
      if (containerRef.current) {
        const { destroy } = runContentGenerator(
          containerRef.current,
          doc_links[0].links,
          doc_nodes,
          navigate
        );
        destroyFn = destroy;
      }
    };
    getData();

    return destroyFn;
  }, [query]);

  return <div ref={containerRef} className={styles.content} />;
};

export default Content;
