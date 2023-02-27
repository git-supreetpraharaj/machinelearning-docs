import React, { useEffect, useRef, useState } from "react";
import { runContentGenerator } from "./ContentGenerator";
import styles from "./content.module.css";

const Content = ({ linksData, nodesData, nodeHoverTooltip, query }) => {
  const containerRef = useRef(null);

  useEffect(() => {
    let destroyFn;

    if (containerRef.current) {
      const { destroy } = runContentGenerator(
        containerRef.current,
        linksData,
        nodesData
      );
      destroyFn = destroy;
    }
    return destroyFn;
  }, [query]);

  return <div ref={containerRef} className={styles.content} />;
};

export default Content;
