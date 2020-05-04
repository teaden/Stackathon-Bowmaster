class Arrow extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, 'arrows')
    }

    fire(x, y) {
        this.body.reset(x, y)
        this.setActive(true)
        this.setVisible(true)
        this.setVelocityX(500)
    }
}

class ArrowGroup extends Phaser.Physics.Arcade.Group {
    constructor(scene) {
        super(scene.physics.world, scene)

        this.createMultiple({
            classType: Arrow,
            frameQuantity: 10,
            active: false,
            visible: false,
            key: 'arrows'
        })
    }

    fireArrow(x, y) {
        const arrow = this.getFirstDead(false)
        if (arrow) {
            arrow.fire(x, y)
        }
    }
}