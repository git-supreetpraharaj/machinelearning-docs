import { forceCenter, forceLink, forceManyBody, forceSimulation, pointer, select, zoom } from 'd3';
import { rectCollide } from './RectCollide';
import { clickEvent, dragEvent, hoverEvent } from './Events';
import { rectConstruct } from './RectConstruct';
import { wrap } from './TextWrap';

export const runContentGenerator = (
    container,
    linksData,
    nodesData,
    setDocLinks,
    navigate,
    user,
    editable
) => {
    const linkData = linksData.map((d) => Object.assign({}, d));
    const nodeData = nodesData.map((d) => Object.assign({ width: 125, height: 100 }, d));

    const containerRect = container.getBoundingClientRect();
    const height = containerRect.height;
    const width = containerRect.width;
    let isCircleClicked = false;
    const simulation = forceSimulation()
        .nodes(nodeData)
        .force('center', forceCenter(width / 2, height / 2))
        .force(
            'link',
            forceLink(linkData)
                .id((d) => d.id)
                .distance(200)
        )
        .force('collide', rectCollide())
        .force('charge', forceManyBody().strength(-250));

    const zoomBehavior = zoom()
        .scaleExtent([1, 3])
        .translateExtent([
            [0, 0],
            [width, height]
        ])
        .on('zoom', (e) => {
            if (!isCircleClicked) {
                select('svg').attr('transform', e.transform);
            }
        });

    const svg = select(container)
        .append('svg')
        .attr('viewBox', [0, 0, width, height])
        .call(zoomBehavior);

    const defs = svg.append('defs');

    const filter = defs.append('filter').attr('id', 'drop-shadow').attr('height', '150%');

    filter
        .append('feGaussianBlur')
        .attr('in', 'SourceAlpha')
        .attr('stdDeviation', 5)
        .attr('result', 'blur');

    filter
        .append('feOffset')
        .attr('in', 'blur')
        .attr('dx', 5)
        .attr('dy', 5)
        .attr('result', 'offsetBlur');

    const feMerge = filter.append('feMerge');

    feMerge.append('feMergeNode').attr('in', 'offsetBlur');
    feMerge.append('feMergeNode').attr('in', 'SourceGraphic');

    const nodeWidth = 150;
    const nodeHeight = 100;
    const nodeRadius = 5;

    const links = svg
        .append('g')
        .attr('stroke', '#999')
        .attr('stroke-opacity', 1.0)
        .selectAll('line')
        .data(linkData)
        .join('line')
        .attr('stroke-width', (d) => Math.sqrt(d.value));

    const nodes = svg
        .append('g')
        .attr('stroke', 'black')
        .attr('stroke-width', 2)
        .selectAll('path')
        .data(nodeData)
        .join('g');

    nodes
        .append('path')
        .attr('d', (d) =>
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
        .style('stroke', 'black')
        .style('fill', 'white')
        .style('filter', 'url(#drop-shadow)')
        .call(dragEvent(simulation))
        .on('mouseover', hoverEvent)
        .on('mouseout', hoverEvent)
        .on('click', (event, d) => clickEvent(event, d, navigate));

    nodes
        .append('path')
        .attr('d', (d) =>
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
        .style('stroke', 'black')
        .style('fill', 'white')
        .style('filter', 'url(#drop-shadow)')
        .call(dragEvent(simulation))
        .on('mouseover', hoverEvent)
        .on('mouseout', hoverEvent)
        .on('click', (event, d) => clickEvent(event, d, navigate));

    nodes
        .append('text')
        .attr('stroke', 'black')
        .attr('stroke-width', 0.8)
        .attr('x', -nodeWidth / 2 + 10)
        .attr('y', -nodeHeight / 2 + 16)
        .attr('data-width', nodeWidth - 20)
        .attr('data-height', nodeHeight / 4)
        .attr('font-size', 12)
        .style('cursor', 'pointer')
        .text((d) => {
            return d.name;
        })
        .call(wrap)
        .call(dragEvent(simulation))
        .on('mouseover', hoverEvent)
        .on('mouseout', hoverEvent)
        .on('click', (event, d) => clickEvent(event, d, navigate));

    nodes
        .append('text')
        .attr('stroke', 'black')
        .attr('stroke-width', 0.5)
        .attr('x', -nodeWidth / 2 + 10)
        .attr('y', -nodeHeight / 4 + 20)
        .attr('data-width', nodeWidth - 20)
        .attr('data-height', (3 * nodeHeight) / 4 + 10)
        .attr('font-size', 8)
        .style('font-size', '8px')
        .style('cursor', 'pointer')
        .text((d) => d.short)
        .call(wrap)
        .call(dragEvent(simulation))
        .on('mouseover', hoverEvent)
        .on('mouseout', hoverEvent)
        .on('click', (event, d) => clickEvent(event, d, navigate));

    if (user !== null && editable) {
        let line = null;

        const circleNode = nodes
            .append('circle')
            .style('stroke', 'gray')
            .style('fill', 'white')
            .attr('r', 10)
            .attr('cx', (d) => -nodeWidth / 2)
            .attr('cy', (d) => -nodeHeight / 2);

        nodes
            .append('text')
            .attr('stroke', 'darkOrange')
            .attr('stroke-width', 0.5)
            .attr('x', -nodeWidth / 2 - 3)
            .attr('y', -nodeHeight / 2 + 3)
            .attr('data-width', nodeWidth - 20)
            .attr('data-height', (3 * nodeHeight) / 4 + 10)
            .attr('font-size', 10)
            .style('font-size', '10px')
            .style('cursor', 'pointer')
            .text((d) => d.id)
            .call(wrap);

        let activeLink = null;
        let deleteLinkButton = null;
        let sourceId = null;
        let targetId = null;

        svg.on('pointerdown', (event) => {
            const mousePos = pointer(event);

            if (deleteLinkButton) {
                const deleteLink = deleteLinkButton.selectAll('path');
                const box = deleteLink.node().getBBox();
                const x = mousePos[0];
                const y = mousePos[1];
                if (x < box.x || x > box.x + box.width || y < box.y || y > box.y + box.height) {
                    deleteLinkButton.remove();
                    deleteLinkButton = null;
                    if (activeLink) {
                        activeLink.style('stroke-width', '1px');
                        activeLink = null;
                    }
                }
            }

            circleNode.each((d) => {
                const distanceSource = Math.sqrt(
                    (mousePos[0] - (d.x - nodeWidth / 2)) ** 2 +
                        (mousePos[1] - (d.y - nodeHeight / 2)) ** 2
                );
                if (distanceSource <= 10) {
                    isCircleClicked = true;
                    sourceId = d.id;
                }
            });
            if (sourceId) {
                line = svg
                    .append('line')
                    .attr('x1', mousePos[0])
                    .attr('y1', mousePos[1])
                    .attr('x2', mousePos[0])
                    .attr('y2', mousePos[1])
                    .style('stroke', 'steelblue')
                    .style('stroke-width', 2);
            }
        });

        svg.on('pointermove', (event) => {
            if (line) {
                const mousePos = pointer(event);
                const x2 = mousePos[0];
                const y2 = mousePos[1];
                line.attr('x2', x2).attr('y2', y2);
            }
        });

        svg.on('pointerup', () => {
            isCircleClicked = false;
            if (line) {
                circleNode.each((d) => {
                    const distanceTarget = Math.sqrt(
                        (line.attr('x2') - (d.x - nodeWidth / 2)) ** 2 +
                            (line.attr('y2') - (d.y - nodeHeight / 2)) ** 2
                    );
                    if (distanceTarget <= 10) {
                        targetId = d.id;
                    }
                });
                let newLinksData = [...linksData];
                if (sourceId && targetId && sourceId !== targetId) {
                    const newLink = { source: sourceId, target: targetId };
                    var contains = newLinksData.some((link) => {
                        return link.source === newLink.source && link.target === newLink.target;
                    });
                    if (!contains) {
                        newLinksData.push(newLink);
                        setDocLinks(newLinksData);
                    }
                }
                line.remove();
                line = null;
                sourceId = null;
                targetId = null;
            }
        });

        links.on('mouseover', (event, d) => {
            if (!activeLink) {
                const target = select(event.currentTarget);
                target.style('stroke-width', '4px');
            }
        });

        links.on('mouseout', (event, d) => {
            if (!activeLink) {
                const target = select(event.currentTarget);
                target.style('stroke-width', '1px');
            }
        });

        links.on('click', (event, d) => {
            activeLink = select(event.currentTarget);
            deleteLinkButton = svg.append('g');
            const deleteLink = deleteLinkButton
                .append('path')
                .attr('d', rectConstruct(event.x, event.y - 100, 15, 15, 5, 5, 5, 5))
                // .attr('x', event.x)
                // .attr('y', event.y - 100)
                // .attr('width', 15)
                // .attr('height', 15)
                .style('fill', '#d11a2a')
                .style('stroke', 'black')
                .style('stroke-width', '2px');
            const box = deleteLink.node().getBBox();
            const xPadding = 4;
            deleteLinkButton
                .append('line')
                .attr('x1', box.x + xPadding)
                .attr('y1', box.y + xPadding)
                .attr('x2', box.x + box.width - xPadding)
                .attr('y2', box.y + box.height - xPadding)
                .style('stroke', 'black')
                .style('stroke-width', '2px');
            deleteLinkButton
                .append('line')
                .attr('x1', box.x + xPadding)
                .attr('y1', box.y + box.height - xPadding)
                .attr('x2', box.x + box.width - xPadding)
                .attr('y2', box.y + xPadding)
                .style('stroke', 'black')
                .style('stroke-width', '2px');
            deleteLinkButton.on('click', () => {
                let newLinksData = [
                    ...linksData.filter((link) => {
                        return link.source !== d.source.id || link.target != d.target.id;
                    })
                ];
                setDocLinks(newLinksData);
            });
        });
    }
    simulation.on('tick', () => {
        nodes.attr('transform', (d) => `translate(${d.x}, ${d.y})`);

        links
            .attr('x1', (d) => d.source.x)
            .attr('y1', (d) => d.source.y)
            .attr('x2', (d) => d.target.x)
            .attr('y2', (d) => d.target.y);
    });

    return {
        simulation: simulation,
        svg: svg,
        nodes: () => {
            return svg.node();
        }
    };
};
