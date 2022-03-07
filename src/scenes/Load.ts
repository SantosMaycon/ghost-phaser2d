export default class Load extends Phaser.Scene {
  constructor() {
    super("LoadScene");
  }

  preload() {
    this.load.setBaseURL("assets/");
    this.load.image("background", "background.png");
    this.load.image("player", "player.png");
    this.load.image("wallVertical", "wallVertical.png");
    this.load.image("wallHorizontal", "wallHorizontal.png");
    this.load.image("coin", "coin.png");
    this.load.image("enemy", "enemy.png");

    this.add
      .text(250, 170, "loading", {
        font: "30px Arial",
      })
      .setOrigin(0.5, 0.5);
  }

  create() {
    this.scene.start("MenuScene");
  }
}
