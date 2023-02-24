import React, { useEffect, useRef, useState } from "react";
import { runContentGenerator } from "./ContentGenerator";
import styles from "./content.module.css";

const Content = ({ linksData, nodesData, nodeHoverTooltip, query }) => {
  const containerRef = useRef(null);

  useEffect(() => {
    console.log("runing twice");
    let destroyFn;

    if (containerRef.current) {
      const { destroy } = runContentGenerator(
        containerRef.current,
        linksData,
        nodesData,
        nodeHoverTooltip
      );
      destroyFn = destroy;
    }
    console.log(destroyFn);
    return destroyFn;
  }, [query]);

  return <div ref={containerRef} className={styles.content} />;
};

export default Content;
