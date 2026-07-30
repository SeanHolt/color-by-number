import * as Phaser from 'phaser';
import { Themes } from './Themes';

export class Toolbar {
    private static scrollX: number = 0;

    public static rebuild(scene: any): void {
        scene.paletteButtons.forEach((btn: any) => btn.destroy());
        scene.progressTexts.forEach((txt: any) => txt.destroy());
        scene.paletteButtons.clear();
        scene.progressTexts.clear();

        const colorSet: Set<number> = new Set();
        scene.tileMap.forEach((tileData: any) => colorSet.add(tileData.colorNum));
        const activeGroupIds = Array.from(colorSet).sort((a, b) => a - b);
        const totalUniqueColors = activeGroupIds.length;
        if (totalUniqueColors === 0) return;

        const btnSize = 44; const totalSpacing = 64; const paletteY = 510;
        const maxScroll = Math.max(0, (totalUniqueColors * totalSpacing) - 600);
        
        if (!scene.hasToolbarEvents) {
            scene.hasToolbarEvents = true;
            scene.input.on('pointermove', (p: Phaser.Input.Pointer) => {
                if (p.isDown && p.y > 450) {
                    this.scrollX += (p.x - p.prevPosition.x);
                    this.scrollX = Phaser.Math.Clamp(this.scrollX, -maxScroll, 0);
                    Toolbar.rebuild(scene);
                }
            });
        }

        const startX = 100 + this.scrollX;

        activeGroupIds.forEach((id, displayIdx) => {
            const x = startX + displayIdx * totalSpacing;
            if (x < 40 || x > 760) return;

            const colorHex = Themes.getColorFromId(id, scene.totalUniqueColors);
            const btn = scene.add.rectangle(x, paletteY, btnSize, btnSize, colorHex).setInteractive();
            btn.setStrokeStyle(scene.activeColor === id ? 3 : 1, scene.activeColor === id ? 0xffffff : 0x555555);
            
            btn.on('pointerdown', () => {
                if (scene.isGameOver) return;
                scene.activeColor = id;
                Toolbar.rebuild(scene);
            });

            const r = (colorHex >> 16) & 0xff; const g = (colorHex >> 8) & 0xff; const b = colorHex & 0xff;
            const brightness = (r * 299 + g * 587 + b * 114) / 1000;
            const fontColorString = brightness > 150 ? '#111111' : '#ffffff';

            const numberLabel = scene.add.text(x, paletteY, `${id}`, { fontSize: '16px', color: fontColorString, fontStyle: 'bold' }).setOrigin(0.5);

            // FIXED: Audit percentages directly via the clean memory lookup dictionary
            let total = 0; let painted = 0;
            scene.tileMap.forEach((tileData: any) => {
                if (tileData.colorNum === id) { total++; if (tileData.filled) painted++; }
            });

            const ratio = Math.round((painted / total) * 100);
            const percentLabel = scene.add.text(x, paletteY + 36, `${ratio}%`, { fontSize: '11px', color: '#aaa', fontStyle: 'bold' }).setOrigin(0.5);

            scene.paletteButtons.set(id, btn); scene.progressTexts.set(id, percentLabel);
            scene.gridCamera.ignore(btn); scene.gridCamera.ignore(numberLabel); scene.gridCamera.ignore(percentLabel);
        });

        if (scene.activeBrushIndicator) {
            // FIXED: Changed setFillColor to setFillStyle for Phaser v3 compliance
            scene.activeBrushIndicator.setFillStyle(
                Themes.getColorFromId(scene.activeColor, scene.totalUniqueColors)
            );
        }
    }
}
