import "./events.ts"
import type { Point, Project, Rectangle } from "./project.ts";
import { camera, canvas, ctx, projIntersect } from "./props";
import { drawBezier, drawRectangle, syncCanvasSize } from "./utils.ts";

const projData = await fetch("/info.json").then((data) => data.text());
const projects = JSON.parse(projData) as Array<Project>;
let projAdded = false;


function render() {
        const logicalWidth = 1908;

        const widthScale = canvas.width / logicalWidth;

        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        ctx.scale(widthScale, widthScale);

        ctx.translate(camera.x, camera.y);
        ctx.scale(camera.zoom, camera.zoom);
        ctx.beginPath();

        const middle = { x: logicalWidth / 2 - 100, y: canvas.height / 2 - 100 } as Point;
        drawRectangle({ rect: { coords: middle, width: 200, height: 200, radius: 25 }, text: "Žiga Trop", fontSize: 35 });

        for (const project of projects) {
                const bezierEnd = project.point;
                const startX = bezierEnd.x > middle.x ? middle.x + 200 : middle.x;
                const start = { x: startX, y: canvas.height / 2 } as Point;
                drawBezier(start, project);

                const rectX = bezierEnd.x > start.x ? bezierEnd.x : bezierEnd.x - 150;
                const rectStart = { x: rectX, y: project.point.y - 75 } as Point;

                const rect = { coords: rectStart, width: 150, height: 150, radius: 25 } as Rectangle;
                drawRectangle({ rect: rect, color: project.color, text: project.name });

                if (!projAdded) {
                        projIntersect.set(rect, project);
                }

                if (!project.children) continue;

                for (const subProject of project.children) {
                        const headPoint = project.point;
                        const start = { x: headPoint.x - 75, y: headPoint.y - 75 } as Point;
                        drawBezier(start, subProject, project.color);
                        let topLeft: Point;
                        if (headPoint.x - 75 == subProject.point.x) {
                                topLeft = { x: subProject.point.x - 75, y: subProject.point.y - 150 };
                        }
                        else if (headPoint.x > subProject.point.x) {
                                topLeft = { x: subProject.point.x - 150, y: subProject.point.y - 75 };
                        } else {
                                topLeft = { x: subProject.point.x, y: subProject.point.y - 75 };
                        }
                        const subRect = { coords: topLeft, width: 150, height: 150, radius: 25 } as Rectangle;
                        drawRectangle({ rect: subRect, color: subProject.color, text: subProject.name });
                        if (!projAdded) {
                                projIntersect.set(subRect, subProject);
                        }
                }
        }
        projAdded = true;
        requestAnimationFrame(render);
}


syncCanvasSize();
requestAnimationFrame(render);
