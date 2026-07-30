export interface ColorPreset {
    id: string;
    name: string;
    unlockCriteria: string;
    levelsRequired: number;
    colors: { id: number; color: number }[];
}

export class PaletteManager {
    // Pre-configured collectible color themes
    public static presets: ColorPreset[] = [
        {
            id: 'classic',
            name: '🎨 CLASSIC PRIMARIES',
            unlockCriteria: 'Unlocked by default',
            levelsRequired: 0,
            colors: [{ id: 1, color: 0xff5733 }, { id: 2, color: 0x33ff57 }, { id: 3, color: 0x3357ff }]
        },
        {
            id: 'pastel',
            name: '🌸 SWEET PASTELS',
            unlockCriteria: 'Clear 1 puzzle to unlock',
            levelsRequired: 1,
            colors: [{ id: 1, color: 0xffb7b2 }, { id: 2, color: 0xe2f0cb }, { id: 3, color: 0xb5ead7 }]
        },
        {
            id: 'neon',
            name: '⚡ NEON GLOW',
            unlockCriteria: 'Clear 3 puzzles to unlock',
            levelsRequired: 3,
            colors: [{ id: 1, color: 0xff007f }, { id: 2, color: 0x00ff66 }, { id: 3, color: 0x00ffff }]
        },
        {
            id: 'cyberpunk',
            name: '🌌 CYBERPUNK DARK',
            unlockCriteria: 'Clear 5 puzzles to unlock',
            levelsRequired: 5,
            colors: [{ id: 1, color: 0xf1c40f }, { id: 2, color: 0x9b59b6 }, { id: 3, color: 0xe67e22 }]
        }
    ];

    /**
     * Determines how many unique levels have been saved as complete
     */
    public static getClearedCount(): number {
        const savedDataString = localStorage.getItem('colorGame_progress');
        if (!savedDataString) return 0;
        try {
            const list = JSON.parse(savedDataString);
            return Array.isArray(list) ? list.length : 0;
        } catch {
            return 0;
        }
    }

    /**
     * Retrieves the current active preset selection key from storage
     */
    public static getActivePreset(): ColorPreset {
        const activeId = localStorage.getItem('colorGame_activePresetId') || 'classic';
        const found = this.presets.find(p => p.id === activeId);
        
        // Safety Fallback: verification rules lock theme changes to unlocked configurations
        if (found && this.getClearedCount() >= found.levelsRequired) {
            return found;
        }
        return this.presets[0]; // Fallback to classic primaries
    }

    /**
     * Updates the persistent theme storage key token securely
     */
    public static setActivePreset(id: string): boolean {
        const found = this.presets.find(p => p.id === id);
        if (found && this.getClearedCount() >= found.levelsRequired) {
            localStorage.setItem('colorGame_activePresetId', id);
            return true;
        }
        return false;
    }
}