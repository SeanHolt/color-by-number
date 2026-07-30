import * as Phaser from 'phaser';
import { Generator, LevelData, ShapeProfile } from './Generator';
import { Themes } from './Themes';
import { Audio } from './Audio';
import { Storage } from './Storage';
import { Toolbar } from './Toolbar';
import { Slider } from './Slider';
import { WinScreen } from './WinScreen';

export class Play extends Phaser.Scene {
    public lvl!: LevelData;
    public shapesList: ShapeProfile[] = [];
    public activeColor: number = 1;
    public painted: number = 0;
    public targets: number = 0;
    public mistakes: number = 0;
    public isGameOver: boolean = false;
    public isSliderDragging: boolean = false;
    public totalUniqueColors: number = 1;

    public mistakeText!: Phaser.GameObjects.Text;
    public gridCamera!: Phaser.Cameras.Scene2D.Camera;
    public gridTilesGroup!: Phaser.GameObjects.Group;
    public paletteButtons: Map<number, Phaser.GameObjects.Rectangle> = new Map();
    public progressTexts: Map<number, Phaser.GameObjects.Text> = new Map();
    public activeBrushIndicator!: Phaser.GameObjects.Rectangle;

    // Direct memory dictionary mapping unique index strings to Polygon object properties
    public tileMap: Map<string, { poly: Phaser.GameObjects.Polygon, text: Phaser.GameObjects.Text, colorNum: number, filled: boolean }> = new Map();

    constructor() { super('Play'); }

    init(data: { level: LevelData }) {
        this.lvl = data.level;
        this.shapesList = Generator.getShapes(this.lvl);
        this.painted = 0; this.targets = 0; this.mistakes = 0;
        this.isGameOver = false; this.isSliderDragging = false;
        
        this.paletteButtons.clear(); 
        this.progressTexts.clear();
        this.tileMap.clear();

        const colorSet: Set<number> = new Set();
        this.shapesList.forEach(s => colorSet.add(s.id));
        this.totalUniqueColors = Math.max(1, colorSet.size);
    }

    create() {
        this.gridCamera = this.cameras.add(0, 80, 800, 380);
        this.gridCamera.setBackgroundColor('rgba(0,0,0,0)');
        this.gridTilesGroup = this.add.group();

        this.cameras.main.fadeIn(300, 26, 26, 26);
        this.buildLevelCells();
        this.buildHudElements();
        Slider.build(this);
        
        this.cameras.main.ignore(this.gridTilesGroup);
        this.children.list.forEach((child: any) => {
            if (child.type === 'Text' && child.style && child.style.color === '#555') {
                this.cameras.main.ignore(child);
                return;
            }
            if (!this.gridTilesGroup.contains(child) && child !== this.gridCamera) {
                this.gridCamera.ignore(child);
            }
        });

        this.setupPanControls();
    }

    private buildLevelCells() {
        this.shapesList.forEach((shape, idx) => {
            this.targets++;

            // 1. GENERATE THE IRREGULAR POLYGON SHAPE MESH
            // Origin centered at 0,0 initially, then custom positioning offsets can be applied
            const poly = this.add.polygon(0, 0, shape.points, 0xdddddd);
            
            // Re-map the physics origins so coordinates align with screen layouts
            poly.setTo(shape.points);
            poly.setOrigin(0, 0);

            // Configure geometric hit-testing bounds
            const geomPoly = new Phaser.Geom.Polygon(shape.points);
            poly.setInteractive(geomPoly, Phaser.Geom.Polygon.Contains);
            poly.setStrokeStyle(1, 0xbbbbbb);

            // 2. OVERLAY THE TEXT IDENTIFIER AT THE PRE-CALCULATED CENTER POINT
            const text = this.add.text(shape.labelX, shape.labelY, `${shape.id}`, { 
                fontSize: '14px', color: '#555', fontStyle: 'bold' 
            }).setOrigin(0.5);

            this.gridTilesGroup.add(poly);

            const key = `shape-${idx}`;
            this.tileMap.set(key, { poly: poly, text: text, colorNum: shape.id, filled: false });

            poly.on('pointerup', (p: Phaser.Input.Pointer) => {
                if (this.isGameOver || this.isSliderDragging) return;
                
                if (this.activeColor === shape.id) {
                    const hexColor = Themes.getColorFromId(shape.id, this.totalUniqueColors);
                    poly.setFillStyle(hexColor);
                    text.setVisible(false);
                    
                    const tileData = this.tileMap.get(key);
                    if (tileData) tileData.filled = true;

                    this.painted++;
                    this.checkColorGroupCompletion(shape.id);
                    this.checkEnd();
                } else {
                    this.mistakes++;
                    this.mistakeText.setText(`MISTAKES: ${this.mistakes}`);
                    Audio.play('thud');
                }
            });
        });
    }

    private buildHudElements() {
        const titleTxt = this.add.text(20, 20, `LEVEL: ${this.lvl.name}`, { fontSize: '20px', color: '#ffffff', fontStyle: 'bold' });
        this.activeBrushIndicator = this.add.rectangle(190, 31, 24, 24, 0xffffff);
        this.activeBrushIndicator.setStrokeStyle(2, 0xffffff);
        const brushLabel = this.add.text(225, 22, 'BRUSH ACTIVE', { fontSize: '14px', color: '#bdc3c7' });
        this.mistakeText = this.add.text(20, 50, `MISTAKES: 0`, { fontSize: '16px', color: '#e74c3c', fontStyle: 'bold' });

        const menuBtn = this.add.text(750, 30, 'MENU', { fontSize: '18px', color: '#fff' }).setOrigin(1, 0).setInteractive();
        menuBtn.on('pointerdown', () => { if (!this.isGameOver) this.scene.start('Menu'); });

        Toolbar.rebuild(this);
    }

    private setupPanControls() {
        this.input.on('pointermove', (p: Phaser.Input.Pointer) => {
            if (this.isGameOver || !p.isDown || this.isSliderDragging || p.y < 80 || p.y > 440 || p.x > 720) return;
            this.gridCamera.scrollX -= (p.x - p.prevPosition.x) / this.gridCamera.zoom;
            this.gridCamera.scrollY -= (p.y - p.prevPosition.y) / this.gridCamera.zoom;
        });

        this.input.on('wheel', (pointer: Phaser.Input.Pointer, gameObjects: any, deltaX: number, deltaY: number) => {
            if (this.isGameOver || this.isSliderDragging) return;
            Slider.updateZoom(this, this.gridCamera.zoom - deltaY * 0.002);
        });
    }

    public checkColorGroupCompletion(colorId: number) {
        let total = 0; let painted = 0;
        this.tileMap.forEach((tileData) => {
            if (tileData.colorNum === colorId) {
                total++;
                if (tileData.filled) painted++;
            }
        });

        if (painted < total) { Toolbar.rebuild(this); return; }
        Audio.play('pop');

        let nextColorId = -1;
        for (let checkId = 1; checkId <= this.totalUniqueColors; checkId++) {
            if (checkId === colorId || nextColorId !== -1) continue;
            let tCount = 0; let pCount = 0;
            this.tileMap.forEach((tileData) => {
                if (tileData.colorNum === checkId) { tCount++; if (tileData.filled) pCount++; }
            });
            if (tCount > pCount) nextColorId = checkId;
        }

        if (nextColorId !== -1) this.activeColor = nextColorId;
        Toolbar.rebuild(this);
    }

    private checkEnd() {
        let isPuzzlesCleared = true;
        this.tileMap.forEach((tileData) => { if (!tileData.filled) isPuzzlesCleared = false; });
        if (isPuzzlesCleared) { this.isGameOver = true; WinScreen.show(this); }
    }
}
