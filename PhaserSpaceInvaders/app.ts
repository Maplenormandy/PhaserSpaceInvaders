class SimpleGame {
    constructor() {
        this.game = new Phaser.Game(800, 600, Phaser.AUTO, 'content', { preload: this.preload, create: this.create, update: this.update });
    }

    game: Phaser.Game;
    cursors: Phaser.CursorKeys;
    ship: Phaser.Sprite;
    bullets: Phaser.Group;
    aliens: Phaser.Group;
    fireButton: Phaser.Key;
    bulletTime: number;

    preload() {
        this.game.load.image('ship', 'ship.png');
        this.game.load.image('invader', 'spaceinvader.png');
        this.game.load.image('bullet', 'bullet.png');
    }

    create() {
        this.bulletTime = 0;

        this.game.physics.startSystem(Phaser.Physics.ARCADE);

        // The player!
        this.ship = this.game.add.sprite(this.game.world.bounds.centerX, this.game.world.bounds.bottom, 'ship');
        this.ship.anchor.set(0.5, 1.0);
        this.game.physics.enable(this.ship, Phaser.Physics.ARCADE);

        // Bullets
        this.bullets = this.game.add.group();
        this.bullets.enableBody = true;
        this.bullets.physicsBodyType = Phaser.Physics.ARCADE;
        this.bullets.createMultiple(30, 'bullet');
        this.bullets.setAll('anchor.x', 0.5);
        this.bullets.setAll('anchor.y', 1.0);
        this.bullets.setAll('outOfBoundsKill', true);
        this.bullets.setAll('checkWorldBounds', true);

        this.fireButton = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

        // Aliens
        this.aliens = this.game.add.group();
        this.aliens.enableBody = true;
        this.aliens.physicsBodyType = Phaser.Physics.ARCADE;

        for (var y = 0; y < 2; y++) {
            for (var x = 0; x < 4; x++) {
                var alien = this.aliens.create(x * 150, y * 150, 'invader');
                alien.anchor.setTo(0.5, 0.5);
            }
        }

        this.aliens.x = 100;
        this.aliens.y = 50;

        var tween = this.game.add.tween(this.aliens).to({ x: 200 }, 2000, Phaser.Easing.Linear.None, true, 0, 1000, true);

        this.cursors = this.game.input.keyboard.createCursorKeys();
    }

    update() {
        if (this.cursors.left.isDown) {
            this.ship.body.velocity.x = -200;
        } else if (this.cursors.right.isDown) {
            this.ship.body.velocity.x = 200;
        } else {
            this.ship.body.velocity.x = 0;
        }

        if (this.fireButton.isDown) {
            if (this.game.time.now > this.bulletTime) {
                var bullet = this.bullets.getFirstExists(false); 

                if (bullet) {
                    bullet.reset(this.ship.x, this.ship.y - 50);
                    bullet.body.velocity.y = -400;
                    this.bulletTime = this.game.time.now + 200;
                }
            }
        }

        var overlap = this.game.physics.arcade.overlap(this.bullets, this.aliens, this.collisionHandler, null, this);
        console.log(overlap);
    }

    collisionHandler(bullet, alien) {
        console.log('callback');
        bullet.kill();
        alien.kill();
    }
}

window.onload = () => {
    var game = new SimpleGame();
};