import { Game } from 'phaser';
import { GameConfig } from './config';

const StartGame = (parent: string) => {
    return new Game({ ...GameConfig, parent });
}

export default StartGame;
