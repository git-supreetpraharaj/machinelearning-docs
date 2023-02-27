import { select } from "d3";

export const wrap = (selection) => {
  selection.each(function () {
    const node = select(this);
    const rectWidth = +node.attr("data-width");
    const rectHeight = +node.attr("data-height");
    const fontSize = +node.attr("font-size");
    const x = +node.attr("x");
    const y = +node.attr("y");

    const words = node.text().split(/\s+/).reverse();
    let word = words.pop();
    let line = [];
    let lineNumber = 0;
    let tspan = node.text(null).append("tspan").attr("x", x).attr("y", y);
    let numWords = -1;

    while (word) {
      const tspanHeight = tspan.node().getBoundingClientRect().height;
      line.push(word);
      tspan.text(line.join(" "));
      const tspanLength = tspan.node().getComputedTextLength();

      if (tspanLength > rectWidth) {
        lineNumber += 1;
        line.pop();
        if ((lineNumber + 1) * tspanHeight > rectHeight) {
          if (
            tspan
              .text(line.join(" ") + " ...")
              .node()
              .getComputedTextLength() > rectWidth
          ) {
            line.pop();
          }
          tspan.text(line.join(" ") + " ...");
          break;
        } else tspan.text(line.join(" "));
        line = [word];
        tspan = node
          .append("tspan")
          .attr("x", x)
          .attr("y", y + lineNumber * fontSize)
          .text(word);
      }
      word = words.pop();
    }
  });
};
