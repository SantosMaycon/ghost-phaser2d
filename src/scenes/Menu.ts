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

    let best_score = localStorage.getItem("best_score");

    if (best_score) {
      if (score > Number(best_score)) {
        localStorage.setItem("best_score", score.toString());
        best_score = score.toLocaleString();
      }
    } else {
      localStorage.setItem("best_score", "0");
      best_score = "0";
    }

    this.add.image(250, 170, "background");

    const label_title = this.add
      .text(250, 80, "Super Coin Box", {
        font: "50px Geo",
      })
      .setOrigin(0.5, 0.5);

    const label = `Score ${score}\nBest Score ${best_score}`;

    this.add
      .text(250, 170, label, {
        font: "25px Arial",
        align: "center",
      })
      .setOrigin(0.5, 0.5);

    const startText = this.sys.game.device.os.desktop
      ? "Press the up arrow key to start"
      : "Touch the screen to start";

    this.add
      .text(250, 275, startText, {
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
    if (!this.sys.game.device.os.desktop && this.input.activePointer.y < 60) {
      return;
    }

    if (
      this.up_key.isDown ||
      (!this.sys.game.device.os.desktop && this.input.activePointer.isDown)
    ) {
      this.scene.start("PlayScene");
    }
  }
}
