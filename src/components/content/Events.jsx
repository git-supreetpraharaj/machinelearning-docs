import { drag, select } from "d3";

export const dragEvent = (simulation) => {
  const dragstarted = (event, d) => {
    if (!event.active) simulation.alphaTarget(0.3).restart();
    d.fx = d.x;
    d.fy = d.y;
  };

  const dragged = (event, d) => {
    d.fx = event.x;
    d.fy = event.y;
  };

  const dragended = (event, d) => {
    if (!event.active) simulation.alphaTarget(0);
    d.fx = null;
    d.fy = null;
  };

  return drag()
    .on("start", dragstarted)
    .on("drag", dragged)
    .on("end", dragended);
};

export const hoverEvent = (event) => {
  // console.log(selection)
  const target = select(
    event.target.nodeName === "tspan"
      ? event.target.parentNode.parentNode
      : event.target.parentNode
  ).selectAll("path");
  const state = target.style("stroke") === "black" ? "teal" : "black";
  target.style("stroke", state);
};


export const clickEvent = (event) => {
  
}