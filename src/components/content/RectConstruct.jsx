export const rectConstruct = (
  x,
  y,
  width,
  height,
  topLeftRadius,
  topRightRadius,
  bottomRightRadius,
  bottomLeftRadius
) => {
  const topWidth = width - topLeftRadius - topRightRadius;
  const bottomWidth = width - bottomLeftRadius - bottomRightRadius;
  const leftHeight = height - topLeftRadius - bottomLeftRadius;
  const rightHeight = height - topRightRadius - bottomRightRadius;

  return `
        m ${x} ${y + topLeftRadius}
        q 0 ${-topLeftRadius} ${topLeftRadius} ${-topLeftRadius}
        h ${topWidth}
        q ${topRightRadius} 0 ${topRightRadius} ${topRightRadius}
        v ${rightHeight}
        q 0 ${bottomRightRadius} ${-bottomRightRadius} ${bottomRightRadius}
        h ${-bottomWidth}
        q ${-bottomLeftRadius} 0 ${-bottomLeftRadius} ${-bottomLeftRadius}
        v ${-leftHeight}
    `;
};
