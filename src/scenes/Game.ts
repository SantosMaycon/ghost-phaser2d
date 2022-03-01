import Phaser from "phaser";

export default class Main extends Phaser.Scene {
  constructor() {
    super("GameScene");
  }

  private player!: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
  private arrow!: Phaser.Types.Input.Keyboard.CursorKeys;
  private walls!: Phaser.Physics.Arcade.StaticGroup;

  private coin!: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;

  private score!: number;
  private scoreLabel!: Phaser.GameObjects.Text;

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
    this.score += 5;
    this.scoreLabel.setText("Score: " + this.score.toString());

    this.update_coin_position();
  }

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
    if (this.player.y > 340 || this.player.y < 0) {
      this.scene.start("GameScene");
    }
  }

  preload() {
    this.load.setBaseURL("assets/");
    this.load.image("player", "player.png");
    this.load.image("wallVertical", "wallVertical.png");
    this.load.image("wallHorizontal", "wallHorizontal.png");
    this.load.image("coin", "coin.png");
  }

  create() {
    this.score = 0;
    this.scoreLabel = this.add.text(30, 25, "Score: 0", {
      font: "18px Arial",
    });
    this.coin = this.physics.add.sprite(60, 130, "coin");
    this.player = this.physics.add.sprite(250, 170, "player");
    this.player.body.setGravityY(500);
    this.arrow = this.input.keyboard.createCursorKeys();
    this.create_world();
  }

  update(time: number, delta: number) {
    this.physics.collide(this.player, this.walls);
    if (this.physics.overlap(this.player, this.coin)) {
      this.take_coin();
    }
    this.move_player();
    this.player_die();
  }
}
