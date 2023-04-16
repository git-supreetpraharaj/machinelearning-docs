import {
  forceSimulation,
  forceLink,
  forceManyBody,
  select,
  zoom,
  forceCenter,
} from "d3";

import { rectCollide } from "./RectCollide";
import { dragEvent, hoverEvent } from "./Events";
import { rectConstruct } from "./RectConstruct";
import { wrap } from "./TextWrap";

export const runContentGenerator = (container, linksData, nodesData) => {
  const linkData = linksData.map((d) => Object.assign({}, d));
  const nodeData = nodesData.map((d) =>
    Object.assign({ width: 125, height: 100 }, d)
  );

  const containerRect = container.getBoundingClientRect();
  const height = containerRect.height;
  const width = containerRect.width;

  const simulation = forceSimulation()
    .nodes(nodeData)
    .force("center", forceCenter(width / 2, height / 2))
    .force(
      "link",
      forceLink(linkData)
        .id((d) => d.id)
        .distance(200)
    )
    .force("collide", rectCollide())
    .force("charge", forceManyBody().strength(-200));

  const svg = select(container)
    .append("svg")
    .attr("viewBox", [0, -10, width, height])
    .call(
      zoom().on("zoom", (event) => {
        svg.attr("transform", event.transform);
      })
    );

  const defs = svg.append("defs");

  const filter = defs
    .append("filter")
    .attr("id", "drop-shadow")
    .attr("height", "150%");

  filter
    .append("feGaussianBlur")
    .attr("in", "SourceAlpha")
    .attr("stdDeviation", 5)
    .attr("result", "blur");

  const feOffset = filter
    .append("feOffset")
    .attr("in", "blur")
    .attr("dx", 5)
    .attr("dy", 5)
    .attr("result", "offsetBlur");

  const feMerge = filter.append("feMerge");

  feMerge.append("feMergeNode").attr("in", "offsetBlur");
  feMerge.append("feMergeNode").attr("in", "SourceGraphic");

  const nodeWidth = 150;
  const nodeHeight = 100;
  const nodeRadius = 5;
  const expandButtonSize = 20;

  const links = svg
    .append("g")
    .attr("stroke", "#999")
    .attr("stroke-opacity", 1.0)
    .selectAll("line")
    .data(linkData)
    .join("line")
    .attr("stroke-width", (d) => Math.sqrt(d.value));

  const nodes = svg
    .append("g")
    .attr("stroke", "black")
    .attr("stroke-width", 2)
    .selectAll("path")
    .data(nodeData)
    .join("g");

  nodes
    .append("path")
    .attr("d", (d) =>
      rectConstruct(
        -nodeWidth / 2,
        -nodeHeight / 2,
        nodeWidth,
        nodeHeight / 4,
        nodeRadius,
        nodeRadius,
        0,
        0
      )
    )
    .style("stroke", "black")
    .style("fill", "white")
    .style("filter", "url(#drop-shadow)")
    .call(dragEvent(simulation))
    .on("mouseover", hoverEvent)
    .on("mouseout", hoverEvent);

  nodes
    .append("path")
    .attr("d", (d) =>
      rectConstruct(
        -nodeWidth / 2,
        -nodeHeight / 2 + nodeHeight / 4,
        nodeWidth,
        (3 * nodeHeight) / 4,
        0,
        0,
        nodeRadius,
        nodeRadius
      )
    )
    .style("stroke", "black")
    .style("fill", "white")
    .style("filter", "url(#drop-shadow)")
    .call(dragEvent(simulation))
    .on("mouseover", hoverEvent)
    .on("mouseout", hoverEvent);

  nodes
    .append("text")
    .attr("stroke", "black")
    .attr("stroke-width", 0.8)
    .attr("x", -nodeWidth / 2 + 10)
    .attr("y", -nodeHeight / 2 + 16)
    .attr("data-width", nodeWidth - 20)
    .attr("data-height", nodeHeight / 4)
    .attr("font-size", 12)
    .text("Machine Learning Algorithm And its uses")
    .call(wrap)
    .call(dragEvent(simulation))
    .on("mouseover", hoverEvent)
    .on("mouseout", hoverEvent);

  nodes
    .append("text")
    .attr("stroke", "black")
    .attr("stroke-width", 0.5)
    .attr("x", -nodeWidth / 2 + 10)
    .attr("y", -nodeHeight / 4 + 20)
    .attr("data-width", nodeWidth - 20)
    .attr("data-height", (3 * nodeHeight) / 4 + 10)
    .attr("font-size", 12)
    .style("font-size", "12px")
    .text(
      "akjnsdkjnckjsndkjcn jasnd cndjanc ncajksdn ncjkand nndjksan ncajkdsn ncsdjkan njk asnkj cansk cajsnd nckas"
    )
    .call(wrap)
    .call(dragEvent(simulation))
    .on("mouseover", hoverEvent)
    .on("mouseout", hoverEvent);

  nodes
    .append("path")
    .attr("d", (d) =>
      rectConstruct(
        nodeWidth / 2 - expandButtonSize,
        nodeHeight / 2 - expandButtonSize,
        expandButtonSize,
        expandButtonSize,
        0,
        0,
        nodeRadius,
        0
      )
    )
    .style("stroke", "black")
    .style("fill", "white")
    .call(dragEvent(simulation))
    .on("mouseover", hoverEvent)
    .on("mouseout", hoverEvent);

  simulation.on("tick", () => {
    nodes.attr("transform", (d) => `translate(${d.x}, ${d.y})`);

    links
      .attr("x1", (d) => d.source.x)
      .attr("y1", (d) => d.source.y)
      .attr("x2", (d) => d.target.x)
      .attr("y2", (d) => d.target.y);
  });

  return {
    destroy: () => {
      simulation.stop();
      svg.remove();
    },
    nodes: () => {
      return svg.node();
    },
  };
};
