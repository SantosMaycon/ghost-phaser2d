import Phaser from "phaser";
import config from "./config";
import LoadScene from "./scenes/Load";
import MenuScene from "./scenes/Menu";
import PlayScene from "./scenes/Play";

new Phaser.Game(
  Object.assign(config, {
    scene: [LoadScene, MenuScene, PlayScene],
  })
);
