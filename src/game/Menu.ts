import * as Phaser from 'phaser';
import { Storage } from './Storage';
import { LevelData } from './Generator';

export class Menu extends Phaser.Scene {
    private currentPage: number = 0;
    private levelsPerPage: number = 4;
    private renderedElements: Phaser.GameObjects.GameObject[] = [];

    // Embedded XML text blocks - 100% safe from CORS errors and network loading gaps!
    private levels: LevelData[] = [
        {
            id: 1,
            name: "MOUNTAIN PANORAMA",
            rawSvgText: `<svg viewBox="0 0 800 380"><path d="M 0,0 L 400,0 L 400,120 L 0,160 Z" data-color="1" data-label-x="200" data-label-y="60" /><path d="M 400,0 L 800,0 L 800,160 L 400,120 Z" data-color="1" data-label-x="600" data-label-y="60" /><path d="M 0,160 L 400,120 L 400,200 L 0,220 Z" data-color="2" data-label-x="200" data-label-y="160" /><path d="M 400,120 L 800,160 L 800,220 L 400,200 Z" data-color="2" data-label-x="600" data-label-y="160" /><path d="M 350,200 L 400,150 L 450,200 Z" data-color="3" data-label-x="400" data-label-y="180" /><path d="M 0,220 L 150,140 L 300,240 L 0,280 Z" data-color="4" data-label-x="150" data-label-y="200" /><path d="M 300,240 L 450,110 L 600,260 L 300,280 Z" data-color="4" data-label-x="450" data-label-y="180" /><path d="M 600,260 L 720,150 L 800,220 L 600,280 Z" data-color="5" data-label-x="700" data-label-y="210" /><path d="M 0,280 L 250,210 L 500,320 L 0,340 Z" data-color="6" data-label-x="220" data-label-y="280" /><path d="M 500,320 L 680,200 L 800,300 L 500,350 Z" data-color="7" data-label-x="630" data-label-y="280" /><path d="M 0,340 L 500,320 L 800,300 L 800,380 L 0,380 Z" data-color="8" data-label-x="400" data-label-y="350" /></svg>`
        },
        {
            id: 2,
            name: "GEOMETRIC WOLF",
            rawSvgText: `<svg viewBox="0 0 800 380"><path d="M 400,40 L 320,80 L 340,140 Z" data-color="1" data-label-x="350" data-label-y="85" /><path d="M 320,80 L 250,130 L 310,170 Z" data-color="2" data-label-x="290" data-label-y="125" /><path d="M 340,140 L 310,170 L 350,210 Z" data-color="1" data-label-x="335" data-label-y="170" /><path d="M 400,40 L 460,140 L 480,80 Z" data-color="1" data-label-x="450" data-label-y="85" /><path d="M 480,80 L 490,170 L 550,130 Z" data-color="2" data-label-x="510" data-label-y="125" /><path d="M 460,140 L 450,210 L 490,170 Z" data-color="1" data-label-x="465" data-label-y="170" /><path d="M 400,40 L 340,140 L 400,160 Z" data-color="3" data-label-x="380" data-label-y="110" /><path d="M 400,40 L 400,160 L 460,140 Z" data-color="3" data-label-x="420" data-label-y="110" /><path d="M 340,140 L 350,210 L 400,230 L 400,160 Z" data-color="4" data-label-x="375" data-label-y="185" /><path d="M 400,160 L 400,230 L 450,210 L 460,140 Z" data-color="4" data-label-x="425" data-label-y="185" /><path d="M 310,170 L 280,220 L 350,210 Z" data-color="5" data-label-x="315" data-label-y="200" /><path d="M 490,170 L 450,210 L 520,220 Z" data-color="5" data-label-x="485" data-label-y="200" /><path d="M 350,210 L 330,290 L 400,270 L 400,230 Z" data-color="6" data-label-x="370" data-label-y="250" /><path d="M 400,230 L 400,270 L 470,290 L 450,210 Z" data-color="6" data-label-x="430" data-label-y="250" /><path d="M 280,220 L 260,300 L 330,290 Z" data-color="7" data-label-x="290" data-label-y="270" /><path d="M 520,220 L 470,290 L 540,300 Z" data-color="7" data-label-x="510" data-label-y="270" /><path d="M 400,270 L 370,330 L 400,350 L 430,330 Z" data-color="8" data-label-x="400" data-label-y="305" /></svg>`
        },
        {
            id: 3,
            name: "DETAILED FACIAL PORTRAIT",
            // FIXED: Embedded the 22-sharded Mandalic Portrait face directly into your layout memory data tree!
            rawSvgText: `<svg viewBox="0 0 800 380"><path d="M 0,0 L 200,0 L 150,100 L 0,80 Z" data-color="1" data-label-x="90" data-label-y="40" /><path d="M 200,0 L 600,0 L 580,80 L 220,80 Z" data-color="1" data-label-x="400" data-label-y="40" /><path d="M 600,0 L 800,0 L 800,80 L 650,100 Z" data-color="1" data-label-x="710" data-label-y="40" /><path d="M 150,100 L 220,80 L 260,150 L 180,180 Z" data-color="2" data-label-x="200" data-label-y="130" /><path d="M 650,100 L 580,80 L 540,150 L 620,180 Z" data-color="2" data-label-x="600" data-label-y="130" /><path d="M 220,80 L 320,50 L 350,130 L 260,150 Z" data-color="3" data-label-x="285" data-label-y="105" /><path d="M 580,80 L 480,50 L 450,130 L 540,150 Z" data-color="3" data-label-x="515" data-label-y="105" /><path d="M 320,50 L 400,20 L 400,120 L 350,130 Z" data-color="2" data-label-x="370" data-label-y="75" /><path d="M 480,50 L 400,20 L 400,120 L 450,130 Z" data-color="2" data-label-x="430" data-label-y="75" /><path d="M 260,150 L 350,130 L 340,220 L 280,240 Z" data-color="4" data-label-x="310" data-label-y="185" /><path d="M 540,150 L 450,130 L 460,220 L 520,240 Z" data-color="4" data-label-x="490" data-label-y="185" /><path d="M 350,130 L 400,120 L 400,200 L 340,220 Z" data-color="4" data-label-x="370" data-label-y="170" /><path d="M 450,130 L 400,120 L 400,200 L 460,220 Z" data-color="4" data-label-x="430" data-label-y="170" /><path d="M 280,240 L 340,220 L 360,270 L 300,290 Z" data-color="5" data-label-x="320" data-label-y="255" /><path d="M 520,240 L 460,220 L 440,270 L 500,290 Z" data-color="5" data-label-x="480" data-label-y="255" /><path d="M 340,220 L 400,200 L 400,270 L 360,270 Z" data-color="6" data-label-x="375" data-label-y="240" /><path d="M 460,220 L 400,200 L 400,270 L 440,270 Z" data-color="6" data-label-x="425" data-label-y="240" /><path d="M 360,270 L 400,270 L 400,340 L 380,340 Z" data-color="6" data-label-x="385" data-label-y="305" /><path d="M 440,270 L 400,270 L 400,340 L 420,340 Z" data-color="6" data-label-x="415" data-label-y="305" /><path d="M 180,180 L 280,240 L 300,290 L 120,320 Z" data-color="7" data-label-x="220" data-label-y="250" /><path d="M 620,180 L 520,240 L 500,290 L 680,320 Z" data-color="7" data-label-x="580" data-label-y="250" /><path d="M 0,80 L 150,100 L 180,180 L 120,320 L 0,320 Z" data-color="8" data-label-x="90" data-label-y="200" /><path d="M 800,80 L 650,100 L 620,180 L 680,320 L 800,320 Z" data-color="8" data-label-x="710" data-label-y="200" /><path d="M 0,320 L 120,320 L 300,290 L 360,270 L 380,340 L 260,380 L 0,380 Z" data-color="7" data-label-x="180" data-label-y="350" /><path d="M 800,320 L 680,320 L 500,290 L 440,270 L 420,340 L 540,380 L 800,380 Z" data-color="7" data-label-x="620" data-label-y="350" /><path d="M 380,340 L 400,340 L 400,380 L 260,380 Z" data-color="8" data-label-x="360" data-label-y="360" /><path d="M 420,340 L 400,340 L 400,380 L 540,380 Z" data-color="8" data-label-x="440" data-label-y="360" /></svg>`
        }
    ];

    constructor() { super('Menu'); }

    create() {
        this.add.text(400, 60, 'SELECT CHOSEN PICTURE', { 
            fontSize: '32px', 
            color: '#ffffff', 
            fontStyle: 'bold' 
        }).setOrigin(0.5);
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
            
            let difficultyStr = "COMPLEX";
            if (lvl.id === 1) difficultyStr = "PANORAMIC DETAILED";
            if (lvl.id === 2) difficultyStr = "HIGH DENSITY WOLF";
            if (lvl.id === 3) difficultyStr = "REALISTIC FACIAL PORTRAIT";

            const labelStr = unlocked ? `${lvl.name} [${difficultyStr}]` : `🔒 LOCKED (CLEAR LEVEL ${lvl.id - 1})`;
            
            const text = this.add.text(190, startY, labelStr, { fontSize: '16px', color: unlocked ? '#fff' : '#aaa', fontStyle: 'bold' }).setOrigin(0, 0.5);
            this.renderedElements.push(row, text);

            if (unlocked) {
                row.on('pointerdown', () => {
                    this.cameras.main.fadeOut(300, 26, 26, 26);
                    this.cameras.main.once('camerafadeoutcomplete', () => {
                        this.scene.start('Play', { level: lvl });
                    });
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
            btnNext.on('pointerdown', () => {
                this.currentPage++; 
                this.drawPageLayout(); 
            });
        }
    }
}