import { Storage } from './Storage';
import { Audio } from './Audio';

export class WinScreen {
    public static show(scene: any): void {
        if (scene.gridCamera) scene.gridCamera.setVisible(false);
        const stars = scene.mistakes === 0 ? 3 : (scene.mistakes <= 2 ? 2 : 1);
        Storage.saveLevel(scene.lvl.id, stars);
        Audio.play('pop');

        scene.add.rectangle(400, 300, 800, 600, 0x000000, 0.85);
        scene.add.text(400, 180, 'PUZZLE COMPLETE!', { fontSize: '38px', color: '#fff', fontStyle: 'bold' }).setOrigin(0.5);
        scene.add.text(400, 240, `Mistakes: ${scene.mistakes} | Rating: ${'⭐'.repeat(stars)}`, { fontSize: '18px', color: '#f1c40f' }).setOrigin(0.5);

        const btnRetry = scene.add.rectangle(400, 340, 200, 45, 0x34495e).setInteractive();
        scene.add.text(400, 340, 'RESTART PUZZLE', { fontSize: '16px', color: '#fff', fontStyle: 'bold' }).setOrigin(0.5);
        btnRetry.on('pointerdown', () => scene.scene.restart());

        const btnMenu = scene.add.rectangle(400, 410, 200, 45, 0x27ae60).setInteractive();
        scene.add.text(400, 410, 'BACK TO MENUS', { fontSize: '16px', color: '#fff', fontStyle: 'bold' }).setOrigin(0.5);
        
        btnMenu.on('pointerdown', () => {
            scene.cameras.main.fadeOut(300, 26, 26, 26);
            scene.cameras.main.once('camerafadeoutcomplete', () => scene.scene.start('Menu'));
        });
    }
}
