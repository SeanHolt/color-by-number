export interface Theme {
    id: string;
    name: string;
    baseHue: number; // Starting angle on the 360-degree color wheel
}

export class Themes {
    public static list: Theme[] = [
        { id: 'rainbow', name: '🌈 SPECTRAL RAINBOW', baseHue: 0 },
        { id: 'neon', name: '⚡ NEON CYBER', baseHue: 280 },
        { id: 'nature', name: '🌲 ALPINE FOREST', baseHue: 120 },
        { id: 'sunset', name: '🌅 SUNSET BURST', baseHue: 15 }
    ];

    public static getEquipped(): Theme {
        const id = localStorage.getItem('active_theme_id') || 'rainbow';
        return this.list.find(t => t.id === id) || this.list[0];
    }

    public static equip(id: string): void {
        localStorage.setItem('active_theme_id', id);
    }

    /**
     * Procedurally translates any integer ID into a vibrant, high-contrast Hex color
     * Supports 100+ colors by cycling smoothly around the HSL color wheel
     */
    public static getColorFromId(id: number, totalColors: number): number {
        const theme = this.getEquipped();
        
        // Distribute hues evenly across the 360-degree color spectrum
        const hueStep = 360 / Math.max(1, totalColors);
        const hue = (theme.baseHue + (id - 1) * hueStep) % 360;
        
        // Maintain high saturation and balanced lightness so number text stays readable
        const saturation = 0.85; // 85% vibrant
        const lightness = 0.50;  // 50% balanced brightness

        return this.hslToHex(hue, saturation, lightness);
    }

    private static hslToHex(h: number, s: number, l: number): number {
        const c = (1 - Math.abs(2 * l - 1)) * s;
        const x = c * (1 - Math.abs((h / 60) % 2 - 1));
        const m = l - c / 2;
        let r = 0, g = 0, b = 0;

        if (h >= 0 && h < 60) { r = c; g = x; b = 0; }
        else if (h >= 60 && h < 120) { r = x; g = c; b = 0; }
        else if (h >= 120 && h < 180) { r = 0; g = c; b = x; }
        else if (h >= 180 && h < 240) { r = 0; g = x; b = c; }
        else if (h >= 240 && h < 300) { r = x; g = 0; b = c; }
        else if (h >= 300 && h < 360) { r = c; g = 0; b = x; }

        const red = Math.round((r + m) * 255);
        const green = Math.round((g + m) * 255);
        const blue = Math.round((b + m) * 255);

        return (red << 16) + (green << 8) + blue;
    }
}
