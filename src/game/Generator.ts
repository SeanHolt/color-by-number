export interface ShapeProfile {
    id: number;
    labelX: number;
    labelY: number;
    points: number[];
}

export interface LevelData {
    id: number;
    name: string;
    rawSvgText: string; // Storing the XML directly inside the code structure
}

export class Generator {
    public static buildLevelFromSvgText(xmlText: string): ShapeProfile[] {
        const shapes: ShapeProfile[] = [];
        
        // Initialize a native browser DOM parser to navigate the embedded string
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlText, "image/svg+xml");
        const pathElements = xmlDoc.getElementsByTagName("path");

        for (let i = 0; i < pathElements.length; i++) {
            const pathNode = pathElements[i];
            const dAttribute = pathNode.getAttribute("d");
            
            if (!dAttribute) continue;

            const colorId = parseInt(pathNode.getAttribute("data-color") || "1", 10);
            const lx = parseFloat(pathNode.getAttribute("data-label-x") || "0");
            const ly = parseFloat(pathNode.getAttribute("data-label-y") || "0");

            const parsedPoints = this.parseSvgPathToPoints(dAttribute);

            if (parsedPoints.length >= 6) {
                shapes.push({
                    id: colorId,
                    labelX: lx,
                    labelY: ly,
                    points: parsedPoints
                });
            }
        }
        return shapes;
    }

    private static parseSvgPathToPoints(d: string): number[] {
        const points: number[] = [];
        const numbers = d.match(/[-+]?[0-9]*\.?[0-9]+/g);
        
        if (!numbers) return [];

        for (let i = 0; i < numbers.length; i += 2) {
            if (numbers[i] && numbers[i + 1]) {
                points.push(parseFloat(numbers[i]), parseFloat(numbers[i + 1]));
            }
        }
        return points;
    }
}
