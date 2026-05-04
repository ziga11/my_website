import { camera, canvas, modalProps, projIntersect } from "./props";
import { cameraMove, cameraZoom, cursorIntersect, delay, getMousePos, syncCanvasSize } from "./utils";

canvas.addEventListener('wheel', (e) => cameraZoom(e), { passive: false });

canvas.addEventListener("click", (e: MouseEvent) => {
        const worldPos = getMousePos(canvas, e);

        if (camera.moving) return;
        for (const [rect, project] of projIntersect) {
                if (!cursorIntersect(worldPos, rect)) continue;
                modalProps.modal.show();

                modalProps.div?.style.setProperty('--project-color', project.color2);
                modalProps.div?.style.setProperty('--border-color', project.color);

                modalProps.title.innerText = project.name;

                if (typeof project.repo == "string") {
                        modalProps.repo1.href = project.repo;
                        modalProps.repo2.hidden = true;
                }
                else {
                        modalProps.repo2.hidden = false;
                        modalProps.repo1.href = project.repo.frontend;
                        modalProps.repo2.href = project.repo.backend;
                }

                modalProps.body.innerHTML = project.description;
        }
});

canvas.addEventListener("mousemove", (e) => {
        if (camera.moving) return;
        const worldPos = getMousePos(canvas, e);

        for (const [rect, _] of projIntersect) {
                if (cursorIntersect(worldPos, rect)) {
                        canvas.style.cursor = "pointer";
                }
        }
});

canvas.addEventListener("mousedown", () => {
        canvas.addEventListener("mousemove", cameraMove);
});


canvas.addEventListener("mouseup", async () => {
        canvas.removeEventListener("mousemove", cameraMove);
        await delay(500);
        camera.moving = false;
});

const observer = new ResizeObserver((_) => {
        syncCanvasSize();
});

observer.observe(canvas);
