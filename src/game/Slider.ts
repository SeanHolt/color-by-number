import * as Phaser from 'phaser';

export class Slider {
    private static minY = 150;
    private static maxY = 350;
    private static zoomMin = 0.5;
    private static zoomMax = 3.0;
    private static handle: Phaser.GameObjects.Rectangle;

    public static build(scene: any): void {
        const sliderX = 750;
        const track = scene.add.rectangle(sliderX, (this.minY + this.maxY) / 2, 6, this.maxY - this.minY, 0x444444);
        const plusTxt = scene.add.text(sliderX, this.minY - 20, '＋', { fontSize: '16px', color: '#fff' }).setOrigin(0.5);
        const minusTxt = scene.add.text(sliderX, this.maxY + 20, '－', { fontSize: '16px', color: '#fff' }).setOrigin(0.5);

        const initialRatio = (1.0 - this.zoomMin) / (this.zoomMax - this.zoomMin);
        this.handle = scene.add.rectangle(sliderX, this.maxY - (initialRatio * (this.maxY - this.minY)), 20, 20, 0x16a085).setInteractive();
        this.handle.setStrokeStyle(2, 0xffffff);

        scene.gridCamera.ignore(track); scene.gridCamera.ignore(plusTxt); scene.gridCamera.ignore(minusTxt); scene.gridCamera.ignore(this.handle);
        scene.input.setDraggable(this.handle);
        
        this.handle.on('drag', (_: Phaser.Input.Pointer, __: number, dragY: number) => {
            if (scene.isGameOver) return;
            scene.isSliderDragging = true;
            this.handle.y = Phaser.Math.Clamp(dragY, this.minY, this.maxY);

            const ratio = (this.maxY - this.handle.y) / (this.maxY - this.minY);
            scene.gridCamera.setZoom(this.zoomMin + ratio * (this.zoomMax - this.zoomMin));
        });

        scene.input.on('pointerup', () => scene.isSliderDragging = false);
    }

    public static updateZoom(scene: any, newZoom: number): void {
        const zoom = Phaser.Math.Clamp(newZoom, this.zoomMin, this.zoomMax);
        scene.gridCamera.setZoom(zoom);

        const ratio = (zoom - this.zoomMin) / (this.zoomMax - this.zoomMin);
        this.handle.y = this.maxY - (ratio * (this.maxY - this.minY));
    }
}
