import Phaser from "phaser";

export default class Play extends Phaser.Scene {
  constructor() {
    super("PlayScene");
  }

  private player!: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
  private arrow!: Phaser.Types.Input.Keyboard.CursorKeys;
  private walls!: Phaser.Physics.Arcade.StaticGroup;

  private coin!: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;

  private score!: number;
  private scoreLabel!: Phaser.GameObjects.Text;

  private enemies!: Phaser.Physics.Arcade.Group;
  private emitter!: Phaser.GameObjects.Particles.ParticleEmitter;

  private jump_sound!: Phaser.Sound.BaseSound;
  private coin_sound!: Phaser.Sound.BaseSound;
  private dead_sound!: Phaser.Sound.BaseSound;

  private next_enemy!: number;

  private add_enemy() {
    const enemy: Phaser.Types.Physics.Arcade.ImageWithDynamicBody =
      this.enemies.create(250, -10, "enemy");

    enemy.setGravityY(500);
    enemy.setVelocityX(Phaser.Math.RND.pick([-100, 100]));
    enemy.setBounceX(1); // change the direction when hit the wall

    this.time.addEvent({
      delay: 10000,
      callback: () => enemy.destroy(),
    });
  }

  private time_add_enemy(now: number) {
    if (this.next_enemy < now) {
      const start_difficulty = 4000;
      const end_difficulty = 1000;
      const score_to_reach_end_difficulty = 100;

      const progress = Math.min(this.score / score_to_reach_end_difficulty, 1);

      const delay =
        start_difficulty - (start_difficulty - end_difficulty) * progress;

      this.add_enemy();

      this.next_enemy = now + delay;
    }
  }

  private update_coin_position() {
    let positions = [
      { x: 140, y: 60 },
      { x: 360, y: 60 },
      { x: 60, y: 140 },
      { x: 440, y: 140 },
      { x: 130, y: 300 },
      { x: 370, y: 300 },
    ];

    positions = positions.filter((position) => position.x !== this.coin.x);

    const { x, y } = Phaser.Math.RND.pick(positions);

    this.coin.setPosition(x, y);
  }

  private take_coin() {
    this.coin.setScale(0);

    this.tweens.add({
      targets: this.coin,
      scale: 1,
      duration: 300,
    });

    this.tweens.add({
      targets: this.player,
      scale: 1.3,
      duration: 100,
      yoyo: true,
    });

    this.score += 5;
    this.scoreLabel.setText("Score: " + this.score.toString());
    this.coin_sound.play();

    this.update_coin_position();
  }

  private move_player() {
    if (this.arrow.left.isDown) {
      this.player.setVelocityX(-200);
      this.player.anims.play("left", true);
    } else if (this.arrow.right.isDown) {
      this.player.setVelocityX(200);
      this.player.anims.play("right", true);
    } else {
      this.player.setVelocityX(0);
      this.player.setFrame(0);
    }

    if (this.arrow.up.isDown && this.player.body.onFloor()) {
      this.jump_sound.play();
      this.player.setVelocityY(-320);
    }
  }

  private create_world() {
    this.walls = this.physics.add.staticGroup();

    const list_of_walls = [
      { x: 10, y: 170, key: "wallVertical" },
      { x: 490, y: 170, key: "wallVertical" },

      { x: 50, y: 10, key: "wallHorizontal" },
      { x: 450, y: 10, key: "wallHorizontal" },
      { x: 50, y: 330, key: "wallHorizontal" },
      { x: 450, y: 330, key: "wallHorizontal" },

      { x: 0, y: 170, key: "wallHorizontal" },
      { x: 500, y: 170, key: "wallHorizontal" },
      { x: 250, y: 90, key: "wallHorizontal" },
      { x: 250, y: 250, key: "wallHorizontal" },
    ];

    for (const { x, y, key } of list_of_walls) {
      this.walls.create(x, y, key);
    }
  }

  private player_die() {
    const fall_of_world = this.player.y > 340 || this.player.y < 0;
    const overlap_with_enemies = this.physics.overlap(
      this.player,
      this.enemies
    );

    if (fall_of_world || overlap_with_enemies) {
      // this.cameras.main.flash(300, 255, 50, 35);
      this.cameras.main.shake(300, 0.02);
      this.player.destroy();
      this.dead_sound.play();
      this.emitter.explode(40, this.player.x, this.player.y);
      this.time.addEvent({
        delay: 1000,
        callback: () => this.scene.start("MenuScene", { score: this.score }),
      });
    }
  }

  private create_animation() {
    this.anims.create({
      key: "right",
      frames: this.anims.generateFrameNumbers("player", { frames: [1, 2] }),
      frameRate: 8,
      repeat: -1,
    });

    this.anims.create({
      key: "left",
      frames: this.anims.generateFrameNumbers("player", { frames: [3, 4] }),
      frameRate: 8,
      repeat: -1,
    });
  }

  create() {
    this.score = 0;
    this.scoreLabel = this.add.text(30, 25, "Score: 0", {
      font: "18px Arial",
    });
    this.coin = this.physics.add.sprite(60, 130, "coin");
    this.player = this.physics.add.sprite(250, 170, "player");
    this.player.setGravityY(500);
    this.arrow = this.input.keyboard.createCursorKeys();
    this.enemies = this.physics.add.group();

    this.next_enemy = 0;

    this.jump_sound = this.sound.add("jump");
    this.coin_sound = this.sound.add("coin");
    this.dead_sound = this.sound.add("dead");

    const particles = this.add.particles("pixel");
    this.emitter = particles.createEmitter({
      quantity: 15,
      speed: { min: -150, max: 150 },
      scale: { start: 2, end: 0.1 },
      lifespan: 800,
      on: false,
    });

    this.create_animation();
    this.create_world();
  }

  update(time: number, delta: number) {
    this.physics.collide(this.player, this.walls);
    this.physics.collide(this.enemies, this.walls);

    if (!this.player.active) return;

    if (this.physics.overlap(this.player, this.coin)) {
      this.take_coin();
    }

    this.time_add_enemy(Date.now());
    this.move_player();
    this.player_die();
  }
}
