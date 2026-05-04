import { camera, canvas, ctx } from "./props";

export function render() {
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        ctx.translate(camera.x, camera.y);
        ctx.scale(camera.zoom, camera.zoom);

        requestAnimationFrame(render);
}
