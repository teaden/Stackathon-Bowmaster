import Phaser from 'phaser'

import GameScene from './scenes/GameScene'

const config = {
	type: Phaser.AUTO,
	width: 1300,
	height: 800,
	physics: {
		default: 'arcade',
		arcade: {
			gravity: { y: 980 }
		}
	},
	scene: [GameScene]
}

export default new Phaser.Game(config)
