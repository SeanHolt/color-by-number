export interface ShapeProfile {
    id: number;           // The target color number (e.g., 1, 2, 3)
    labelX: number;       // Center coordinates to place the text label
    labelY: number;
    points: number[];     // Flat array of X,Y coordinate sequences [x1, y1, x2, y2, ...]
}

export interface LevelData {
    id: number;
    name: string;
    shapes: ShapeProfile[]; // Swapped flatGrid strings for complex vector polygons
}

export class Generator {
    // Keeps level handovers lightweight and optimized
    public static getShapes(lvl: LevelData): ShapeProfile[] {
        return lvl.shapes || [];
    }
}
