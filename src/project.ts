export interface Point {
        x: number;
        y: number;
}

export interface Rectangle {
        coords: Point;
        width: number;
        height: number;
        radius: number | undefined;
}

export interface Bezier {
        cp1: Point;
        cp2: Point;
        end: Point;
}

export interface Project {
        name: string;
        color: string;
        color2: string;
        repo: string | Repo;
        description: string;
        point: Point;
        children?: Array<Project>;
}

export interface Repo {
        frontend: string;
        backend: string;
}
