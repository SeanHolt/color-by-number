import * as Phaser from 'phaser';
import { Storage } from './Storage';
import { LevelData } from './Generator';

export class Menu extends Phaser.Scene {
    private currentPage: number = 0;
    private levelsPerPage: number = 4;
    private renderedElements: Phaser.GameObjects.GameObject[] = [];

    // Aligned to 8 distinct numerical identifiers (0 = Space, 1 to 8 = Colors)
    private levels: LevelData[] = [
        {
            id: 1,
            name: "PUZZLE MATRIX",
            shapes: [
                // Triangle sector (Target color 1)
                { id: 1, labelX: 350, labelY: 200, points: [300, 150, 400, 150, 350, 250] },
                // Trapezoid sector (Target color 2)
                { id: 2, labelX: 450, labelY: 200, points: [400, 150, 520, 150, 480, 250, 400, 250] },
                // Interlocking L-Shape fragment (Target color 3)
                { id: 3, labelX: 380, labelY: 280, points: [300, 250, 480, 250, 480, 310, 350, 310, 350, 350, 300, 350] }
            ]
        }
    ];

    constructor() { super('Menu'); }

    create() {
        this.add.text(400, 60, 'SELECT CHALLENGE', { fontSize: '32px', color: '#fff', fontStyle: 'bold' }).setOrigin(0.5);
        this.drawPageLayout();
    }

    private drawPageLayout() {
        this.renderedElements.forEach(el => el.destroy());
        this.renderedElements = [];

        const progress = Storage.getProgress();
        const startIdx = this.currentPage * this.levelsPerPage;
        const endIdx = startIdx + this.levelsPerPage;
        const pageItems = this.levels.slice(startIdx, endIdx);

        let startY = 160;

        pageItems.forEach((lvl, relativeIdx) => {
            const globalIndex = startIdx + relativeIdx;
            const cleared = progress.find(p => p.id === lvl.id);
            const unlocked = globalIndex === 0 || progress.some(p => p.id === this.levels[globalIndex - 1].id);

            const row = this.add.rectangle(400, startY, 460, 60, unlocked ? 0x2c3e50 : 0x444444).setInteractive();
            
            // FIXED: Read the shape count directly from the custom polygon array 
            // instead of checking flatGrid.split() strings!
            const countActiveTiles = lvl.shapes ? lvl.shapes.length : 0;
            
            const labelStr = unlocked ? `${lvl.name} (${countActiveTiles} SECTORS)` : `🔒 LOCKED (CLEAR LEVEL ${lvl.id - 1})`;
            
            const text = this.add.text(190, startY, labelStr, { fontSize: '18px', color: unlocked ? '#fff' : '#aaa', fontStyle: 'bold' }).setOrigin(0, 0.5);
            this.renderedElements.push(row, text);

            if (unlocked) {
                row.on('pointerdown', () => {
                    this.cameras.main.fadeOut(300, 26, 26, 26);
                    this.cameras.main.once('camerafadeoutcomplete', () => this.scene.start('Play', { level: lvl }));
                });
                if (cleared) {
                    const starsTxt = this.add.text(590, startY, `⭐`.repeat(cleared.stars), { fontSize: '16px', color: '#f1c40f' }).setOrigin(1, 0.5);
                    this.renderedElements.push(starsTxt);
                }
            }
            startY += 80;
        });

        this.buildNavigationArrows();
    }

    private buildNavigationArrows() {
        const totalPages = Math.ceil(this.levels.length / this.levelsPerPage);
        const navY = 500;
        const pageIndicator = this.add.text(400, navY, `PAGE ${this.currentPage + 1} OF ${totalPages}`, { fontSize: '16px', color: '#fff', fontStyle: 'bold' }).setOrigin(0.5);
        this.renderedElements.push(pageIndicator);

        if (this.currentPage > 0) {
            const btnPrev = this.add.rectangle(250, navY, 90, 36, 0x16a085).setInteractive();
            const txtPrev = this.add.text(250, navY, '◀ PREV', { fontSize: '13px', color: '#fff', fontStyle: 'bold' }).setOrigin(0.5);
            this.renderedElements.push(btnPrev, txtPrev);
            btnPrev.on('pointerdown', () => { this.currentPage--; this.drawPageLayout(); });
        }
        if (this.currentPage < totalPages - 1) {
            const btnNext = this.add.rectangle(550, navY, 90, 36, 0x16a085).setInteractive();
            const txtNext = this.add.text(550, navY, 'NEXT ▶', { fontSize: '13px', color: '#fff', fontStyle: 'bold' }).setOrigin(0.5);
            this.renderedElements.push(btnNext, txtNext);
            btnNext.on('pointerdown', () => { this.currentPage++; this.drawPageLayout(); });
        }
    }
}
