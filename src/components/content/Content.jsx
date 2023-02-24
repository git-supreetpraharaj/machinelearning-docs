import React, { useEffect, useRef, useState } from "react";
import styles from "./content.module.css";
import { select, tree } from "d3";

const Content = () => {
  // Reference to the svg and svg container.
  const svgRef = useRef(null);
  const svgContainer = useRef(null);

  // width and height of the window
  const [width, setWidth] = useState();
  const [height, setHeight] = useState();

  // function to update width and height state
  const getSvgContainerSize = () => {
    const newWidth = svgContainer.current.clientWidth;
    const newHeight = svgContainer.current.clientHeight;

    setWidth(newWidth);
    setHeight(newHeight);
  };

  // Set initial width and height and
  //update width and height on window resize
  useEffect(() => {
    getSvgContainerSize();
    window.addEventListener("resize", getSvgContainerSize);
    return () => window.removeEventListener("resize", getSvgContainerSize);
  }, []);

  // Setup svg and it's elements
  useEffect(() => {
    let dimensions = {
      width: width,
      height: height,
    };

    let margin = {
      top: 10,
      right: 10,
      bottom: 10,
      left: 10,
    };

    dimensions.containerWidth = dimensions.width - (margin.left + margin.right);
    dimensions.containerHeight =
      dimensions.height - (margin.top + margin.bottom);

    const svg = select(svgRef.current)
      .attr("width", dimensions.containerWidth)
      .attr("height", dimensions.containerHeight)
      .attr("transform", `translate(${margin.left}, ${margin.top})`)
      .style("border", "1px solid black");
  }, [width, height]);

  return (
    <div className={styles.content} ref={svgContainer}>
      <svg ref={svgRef} className=""></svg>
    </div>
  );
};

export default Content;
