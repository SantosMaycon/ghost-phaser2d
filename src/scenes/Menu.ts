interface ICreate {
  score: number;
}

export default class Menu extends Phaser.Scene {
  private up_key!: Phaser.Input.Keyboard.Key;

  constructor() {
    super("MenuScene");
  }

  create(data: ICreate) {
    const score = data.score ? data.score : 0;

    this.add.image(250, 170, "background");

    let label_title = this.add
      .text(250, 80, "Super Coin Box", {
        font: "50px Arial",
      })
      .setOrigin(0.5, 0.5);

    this.add
      .text(250, 170, "score: " + score.toString(), {
        font: "25px Arial",
      })
      .setOrigin(0.5, 0.5);

    this.add
      .text(250, 275, "Press the up arrow key to start", {
        font: "25px Arial",
      })
      .setOrigin(0.5, 0.5);

    this.tweens.add({
      targets: label_title,
      scale: 1.2,
      duration: 800,
      yoyo: true,
      repeat: -1,
    });

    this.up_key = this.input.keyboard.addKey("up");
  }

  update() {
    if (this.up_key.isDown) this.scene.start("PlayScene");
  }
}
