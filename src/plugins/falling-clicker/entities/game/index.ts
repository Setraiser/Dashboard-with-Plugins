/** Публичная точка входа в игровую сущность: операции над состоянием и расчёты игры. */
export {
  advanceGame,
  calculateScore,
  clickFallingObject,
  createGameState,
  getDifficultyLevel,
  getRemainingSeconds,
  startGame,
} from "./model/lib/game-logic";
/** Константы игровой модели, используемые другими слоями. */
export { GAME_DURATION_MS } from "./model/const/game-logic";
/** Типы состояния и игровых фигур, необходимые UI и feature-слоям. */
export type {
  FallingObject,
  FallingObjectKind,
  GameState,
  GameStatus,
} from "./model/types/game-state";
