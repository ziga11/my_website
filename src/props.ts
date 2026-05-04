import type { Project, Rectangle } from "./project";

export const bootstrapGlobal = (window as any).bootstrap;

export const canvas = document.querySelector("canvas") as HTMLCanvasElement;

export const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

export const camera = { x: 0, y: 0, zoom: 1, moving: false };

export const projIntersect: Map<Rectangle, Project> = new Map();


export const modalProps = {
        div: document.getElementById("project-modal") as HTMLDivElement,
        modal: new bootstrapGlobal.Modal(document.getElementById("project-modal") as HTMLDivElement),
        title: document.getElementById("modal-title") as HTMLDivElement,
        repo1: document.getElementById("modal-repo-1") as HTMLAnchorElement,
        repo2: document.getElementById("modal-repo-2") as HTMLAnchorElement,
        body: document.querySelector("#project-modal .modal-body") as HTMLDivElement,
        footer: document.querySelector("#project-modal .modal-footer") as HTMLDivElement,
};
