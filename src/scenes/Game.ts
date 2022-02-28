import Phaser from "phaser";

export default class Main extends Phaser.Scene {
  constructor() {
    super("GameScene");
  }

  private player!: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
  private arrow!: Phaser.Types.Input.Keyboard.CursorKeys;
  private walls!: Phaser.Physics.Arcade.StaticGroup;

  private move_player() {
    if (this.arrow.left.isDown) {
      this.player.body.setVelocityX(-200);
    } else if (this.arrow.right.isDown) {
      this.player.body.setVelocityX(200);
    } else {
      this.player.body.setVelocityX(0);
    }

    if (this.arrow.up.isDown && this.player.body.onFloor()) {
      this.player.body.setVelocityY(-320);
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
    this.scene.start("GameScene");
  }

  preload() {
    this.load.setBaseURL("assets/");
    this.load.image("player", "player.png");
    this.load.image("wallVertical", "wallVertical.png");
    this.load.image("wallHorizontal", "wallHorizontal.png");
  }

  create() {
    this.player = this.physics.add.sprite(250, 170, "player");
    this.player.body.setGravityY(500);

    this.arrow = this.input.keyboard.createCursorKeys();

    this.create_world();
  }

  update(time: number, delta: number) {
    this.physics.collide(this.player, this.walls);
    this.move_player();

    if (this.player.y > 340 || this.player.y < 0) {
      this.player_die();
    }
  }
}
