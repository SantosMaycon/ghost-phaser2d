import Phaser from "phaser";

export default class Main extends Phaser.Scene {
  constructor() {
    super("GameScene");
  }

  private player!: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
  private arrow!: Phaser.Types.Input.Keyboard.CursorKeys;

  private move_player() {
    if (this.arrow.left.isDown) {
      this.player.body.setVelocityX(-200);
    } else if (this.arrow.right.isDown) {
      this.player.body.setVelocityX(200);
    } else {
      this.player.body.setVelocityX(0);
    }

    if (this.arrow.up.isDown && this.player.body.onFloor()) {
      console.log("Jump!!!");
      this.player.body.setVelocityY(-320);
    }
  }

  preload() {
    this.load.setBaseURL("assets/");
    this.load.image("player", "player.png");
  }

  create() {
    this.player = this.physics.add.sprite(250, 170, "player");
    this.player.body.setGravityY(500);

    this.arrow = this.input.keyboard.createCursorKeys();
  }

  update(time: number, delta: number) {
    this.move_player();
  }
}
