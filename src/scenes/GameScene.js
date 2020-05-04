import Phaser from 'phaser'

import ScoreLabel from '../ui/ScoreLabel'

const GROUND_KEY = 'ground'
const BOW_KEY = 'bows'
const ARROW_KEY = 'arrows'
const TARGET_KEY = 'target'
let count = 0

export default class GameScene extends Phaser.Scene {
    constructor() {
        super('game-scene')
        this.bow = undefined
        this.platforms = undefined
        this.cursors = undefined
        this.scoreLabel = undefined
        this.arrowGroup = undefined
        this.currentArrow = undefined
        this.target = undefined
        this.velocity = 0
        this.lastShotTime = undefined
        this.loaded = false
        this.gameOver = false
    }

    preload() {
        this.load.image('sky', 'assets/sky.png')
        this.load.image(TARGET_KEY, 'assets/Cyclops.png')
        this.load.image(GROUND_KEY, 'assets/platform.png')
        this.load.image(ARROW_KEY, 'assets/arrow.png')
        this.load.atlas(BOW_KEY, 'assets/bows.png', 'assets/bows_atlas.json')
    }

    create() {
        this.add.image(400, 300, 'sky')
        this.platforms = this.createPlatforms()
        this.arrowGroup = this.createArrows()
        this.player = this.createPlayer()
        this.target = this.createTarget()
        this.scoreLabel = this.createScoreLabel(16, 16, 0)

        this.physics.add.collider(this.arrowGroup, this.target, () => {
            this.arrowGroup.children.each(arrow => {
                arrow.body.allowGravity = false;
                arrow.body.setVelocityX(Math.cos(arrow.rotation));
                arrow.body.setVelocityY(Math.sin(arrow.rotation));

                if (count === 0) {
                    this.scoreLabel.add(550);
                    this.add.text(18, 100, 'Hit (50pts) + Bowmaster Error(500pts)', { color: 'black' })
                    count++
                }
            })
        })

        this.cursor = this.input.activePointer
    }


    update() {
        const angle = Phaser.Math.Angle.Between(this.player.x, this.player.y, this.input.x, this.input.y)
        this.player.setRotation(angle)
        this.arrowGroup.children.each(arrow => { arrow.rotation = Math.atan2(arrow.body.velocity.y, arrow.body.velocity.x) })

        if (this.cursor.leftButtonDown()) {
            if (this.player.frame.name !== "bow_11") {
                this.loaded = true
                this.player.anims.play('load', true)
            } else if (this.player.anims.currentAnim) {
                this.player.anims.pause(this.player.anims.currentAnim.frames[11])
            }
        } else {
            if (this.loaded === true) {
                this.shootArrow(this.varyVelocity(this.player.frame.name))
                this.loaded = false;
                this.velocity = 0
            }
            this.player.setFrame('bow_0')
        }
    }

    varyVelocity(frame) {
        const frameNum = parseInt(frame.slice(4, 6))
        return frameNum * 72
    }

    shootArrow(velocity) {
        if (this.lastShotTime === undefined) {
            this.lastShotTime = 0
        }

        if (this.game.getTime() - this.lastShotTime < 300) {
            return
        }

        this.lastShotTime = this.game.getTime()

        const arrow = this.arrowGroup.getFirstDead(false)
        if (arrow) {
            arrow.body.reset(this.player.x, this.player.y)
            arrow.setActive(true)
            arrow.setVisible(true)
            arrow.rotation = this.player.rotation
            arrow.body.velocity.x = Math.cos(arrow.rotation) * velocity
            arrow.body.velocity.y = Math.sin(arrow.rotation) * velocity
            this.add.text(18, 75, 'Bowmaster Predicts: Miss', { color: 'black' })
        }
    }

    createArrows() {
        const arrows = this.physics.add.group()
        arrows.createMultiple({
            key: 'arrows',
            frameQuantity: 10,
            active: false,
            visible: false,
        })

        return arrows
    }

    loadNextArrow() {
        const currentArrow = this.arrowGroup.getFirstDead(false)
        return currentArrow
    }

    createTarget() {
        const target = this.physics.add.sprite(800, 615, TARGET_KEY).setSize(500, 617)
        target.setScale(0.3)
        console.log(target.size)
        target.body.allowGravity = false
        target.setImmovable(true)
        return target
    }

    createPlatforms() {
        const platforms = this.physics.add.staticGroup()
        platforms.create(400, 790, GROUND_KEY).setScale(5).refreshBody()

        return platforms
    }

    createPlayer() {
        const bow = this.physics.add.sprite(100, 450, BOW_KEY)
        bow.body.setAllowGravity(false)
        this.anims.create({
            key: 'load',
            frames: [
                {
                    key: BOW_KEY,
                    frame: 'bow_0'
                },
                {
                    key: BOW_KEY,
                    frame: 'bow_1'
                },
                {
                    key: BOW_KEY,
                    frame: 'bow_2'
                },
                {
                    key: BOW_KEY,
                    frame: 'bow_3'
                },
                {
                    key: BOW_KEY,
                    frame: 'bow_4'
                },
                {
                    key: BOW_KEY,
                    frame: 'bow_5'
                },
                {
                    key: BOW_KEY,
                    frame: 'bow_6'
                },
                {
                    key: BOW_KEY,
                    frame: 'bow_7'
                },
                {
                    key: BOW_KEY,
                    frame: 'bow_8'
                },
                {
                    key: BOW_KEY,
                    frame: 'bow_9'
                },
                {
                    key: BOW_KEY,
                    frame: 'bow_10'
                },
                {
                    key: BOW_KEY,
                    frame: 'bow_11'
                },
            ]
        })

        return bow
    }

    createScoreLabel(x, y, score) {
        const style = { fontSize: '32px', fill: '#000' }
        const label = new ScoreLabel(this, x, y, score, style)

        this.add.existing(label)

        return label
    }
}