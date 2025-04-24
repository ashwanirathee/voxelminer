import * as VoxelMiner from "./lib/index.js";
import { Game } from "./game/game.js";

/**
 * The main function that initializes the game.
 */
function main() {
  const game = new Game();
  game.init();
}

main();
