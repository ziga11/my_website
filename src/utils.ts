import type { Point, Project, Rectangle } from "./project";
import { camera, canvas, ctx } from "./props";

export function delay(ms: number) { return new Promise(resolve => setTimeout(resolve, ms)) };

export function cameraMove(e: MouseEvent) {
        camera.moving = true;
        const rect = (e.currentTarget as HTMLCanvasElement).getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;

        camera.x += e.movementX * scaleX;
        camera.y += e.movementY * scaleY;
}

export function getMousePos(canvas: HTMLCanvasElement, e: MouseEvent): Point {
        const rect = canvas.getBoundingClientRect();

        let x = e.clientX - rect.left;
        let y = e.clientY - rect.top;

        const ratio = 1908 / canvas.width;
        x *= ratio;
        y *= ratio;

        const worldX = (x - camera.x) / camera.zoom;
        const worldY = (y - camera.y) / camera.zoom;

        return { x: worldX, y: worldY } as Point;
}

export function cameraZoom(e: WheelEvent) {
        e.preventDefault();
        const zoomSpeed = 0.001;
        const rect = canvas.getBoundingClientRect();

        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        const widthScale = canvas.width / 1908;

        const viewportX = mouseX * (canvas.width / rect.width) / widthScale;
        const viewportY = mouseY * (canvas.height / rect.height) / widthScale;

        const worldX = (viewportX - camera.x) / camera.zoom;
        const worldY = (viewportY - camera.y) / camera.zoom;

        const zoomDelta = -e.deltaY * zoomSpeed;
        const newZoom = Math.min(Math.max(camera.zoom + zoomDelta, 0.45), 10);

        camera.zoom = newZoom;

        camera.x = viewportX - worldX * camera.zoom;
        camera.y = viewportY - worldY * camera.zoom;
}

export function syncCanvasSize() {
        const dpr = window.devicePixelRatio || 1;
        const rect = canvas.getBoundingClientRect();

        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
}

/* The points provided must be in the world coordinate system */
export function drawBezier(start: Point, project: Project, startColor: string = "#FFFFFF") {
        const target = project.point;
        const xDiff = target.x - start.x;
        const yDiff = target.y - start.y;

        const gradient = ctx.createLinearGradient(start.x, start.y, target.x, target.y);

        gradient.addColorStop(0, startColor);
        gradient.addColorStop(1, project.color);

        const handleStrength = Math.max(Math.abs(xDiff) * 0.6, 100);
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.lineWidth = 3;
        ctx.strokeStyle = gradient;

        ctx.beginPath();
        ctx.moveTo(start.x, start.y);

        const cp1 = {
                x: xDiff == 0 ? start.x : xDiff > 0 ? start.x + handleStrength : start.x - handleStrength,
                y: start.y + (yDiff * Math.max(0.3, Math.min(xDiff / 750, 0.9)))
        };

        const cp2 = {
                x: xDiff == 0 ? start.x : xDiff > 0 ? start.x + handleStrength : start.x - handleStrength,
                y: target.y
        };

        ctx.bezierCurveTo(cp1.x, cp1.y, cp2.x, cp2.y, target.x, target.y);
        ctx.stroke();
}


export function drawRectangle({
        rect,
        color = "#FFFFFF",
        text,
        fontSize = 24 }: {
                rect: Rectangle,
                color?: string,
                text?: string,
                fontSize?: number,
        }) {

        ctx.beginPath();
        ctx.fillStyle = color + "33";
        ctx.strokeStyle = color;
        ctx.roundRect(rect.coords.x, rect.coords.y, rect.width, rect.height, rect.radius);
        ctx.fill();

        if (text) {
                ctx.fillStyle = "#FFFFFF";
                ctx.textAlign = "center";
                ctx.textBaseline = "middle";
                const padding = 20;

                const centerX = rect.coords.x + rect.width / 2;
                const centerY = rect.coords.y + (rect.height / 2);

                const textWidth = rect.width - padding;

                fillTextMultiline(text, { x: centerX, y: centerY }, textWidth, fontSize - 10, fontSize, 2);
        }
        ctx.stroke();
}

function fillTextMultiline(text: string, centerCoords: Point, width: number, minFontSize: number, maxFontSize: number, maxLines?: number) {
        let lines = [];
        let fontSize = maxFontSize - 1;
        const words = text.split(" ");

        for (; fontSize >= minFontSize; fontSize--) {
                ctx.font = `${fontSize}px Montserrat, sans-serif`;
                let currLine = "";
                for (const word of words) {
                        if (fitsInLine(currLine, word, width)) {
                                currLine = currLine + " " + word;
                        } else {
                                lines.push(currLine);
                                currLine = word;
                        }
                }
                lines.push(currLine);
                if (maxLines == undefined || lines.length <= maxLines) {
                        break;
                } else {
                        lines = [];
                }
        }

        const startY = centerCoords.y - ((lines.length - 1) / 2 * fontSize);
        for (let i = 0; i < lines.length; i++) {
                ctx.fillText(lines[i], centerCoords.x, startY + i * fontSize);
                ctx.stroke();
        }
}

function fitsInLine(line: string, word: string, width: number) {
        const newLine = line + " " + word;
        const measurement = ctx.measureText(newLine);

        return (measurement.width < width);
}

export function cursorIntersect(cursor: Point, rect: Rectangle): boolean {
        if (cursor.x < rect.coords.x || cursor.y < rect.coords.y ||
                cursor.x > rect.coords.x + rect.width ||
                cursor.y > rect.coords.y + rect.height) return false;

        return true;
}

