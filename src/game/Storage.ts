export interface SaveState {
    id: number;
    stars: number;
}

export class Storage {
    private static KEY = 'color_game_save_v1';

    public static getProgress(): SaveState[] {
        const raw = localStorage.getItem(this.KEY);
        return raw ? JSON.parse(raw) : [];
    }

    public static saveLevel(id: number, stars: number): void {
        const list = this.getProgress();
        const item = list.find(p => p.id === id);
        if (item) {
            item.stars = Math.max(item.stars, stars);
        } else {
            list.push({ id, stars });
        }
        localStorage.setItem(this.KEY, JSON.stringify(list));
    }
}