import { quadtree } from 'd3';

export const rectCollide = () => {
    let nodes;
    let padding = 5;
    function force(alpha) {
        const quad = quadtree(
            nodes,
            (d) => d.x,
            (d) => d.y
        );
        for (const d of nodes) {
            quad.visit((q, x1, y1, x2, y2) => {
                let updated = false;
                if (q.data && q.data != d) {
                    let x = d.x - q.data.x,
                        y = d.y - q.data.y,
                        xSpacing = padding + (q.data.width + d.width) / 2,
                        ySpacing = padding + (q.data.height + d.height) / 2,
                        absX = Math.abs(x),
                        absY = Math.abs(y),
                        l,
                        lx,
                        ly;

                    if (absX < xSpacing && absY < ySpacing) {
                        l = Math.sqrt(x * x + y * y);
                        lx = (absX - xSpacing) / l;
                        ly = (absY - ySpacing) / l;
                        if (Math.abs(lx) > Math.abs(y)) {
                            lx = 0;
                        } else {
                            ly = 0;
                        }

                        d.x -= x *= lx;
                        d.y -= y *= ly;

                        updated = true;
                    }
                }
                return updated;
            });
        }
    }

    force.initialize = (_) => (nodes = _);
    return force;
};
