export default class Load extends Phaser.Scene {
  constructor() {
    super("LoadScene");
  }

  private loading_label!: Phaser.GameObjects.Text;

  private progress(value: number) {
    const percentage = Math.round(value * 100) + "%";
    this.loading_label.setText("Loading\n" + percentage);
  }

  preload() {
    this.load.setBaseURL("assets/");
    this.load.image("background", "background.png");
    this.load.spritesheet("player", "player2.png", {
      frameWidth: 20,
      frameHeight: 20,
    });
    this.load.image("wallVertical", "wallVertical.png");
    this.load.image("wallHorizontal", "wallHorizontal.png");
    this.load.image("coin", "coin.png");
    this.load.image("enemy", "enemy.png");
    this.load.image("pixel", "pixel.png");

    this.load.audio("jump", ["jump.ogg", "jump.mp3"]);
    this.load.audio("coin", ["coin.ogg", "coin.mp3"]);
    this.load.audio("dead", ["dead.ogg", "dead.mp3"]);

    this.loading_label = this.add
      .text(250, 170, "Loading\n0%", {
        font: "30px Arial",
        align: "center",
      })
      .setOrigin(0.5, 0.5);
  }

  create() {
    this.load.on("progress", this.progress, this);

    this.scene.start("MenuScene");
  }
}
