import {
  advanceGame,
  calculateScore,
  clickFallingObject,
  createGameState,
  GAME_DURATION_MS,
  getDifficultyLevel,
  startGame,
} from "../../";

/** Проверки модели игры без React, Pixi.js и сетевого API. */
describe("falling clicker game logic", () => {
  /** Целевая фигура увеличивает счёт и удаляется с игрового поля. */
  it("awards points when a target object is clicked", () => {
    const playing = {
      ...startGame(),
      objects: [{ id: 1, kind: "target" as const, x: 0.5, y: 0.2, speed: 0.2 }],
    };

    const result = clickFallingObject(playing, 1);

    expect(result.score).toBe(10);
    expect(result.health).toBe(3);
    expect(result.objects).toHaveLength(0);
    expect(calculateScore(result)).toBe(10);
  });

  /** Клик по приманке отнимает жизнь и не начисляет очки. */
  it("removes a life when a decoy object is clicked", () => {
    const playing = {
      ...startGame(),
      objects: [{ id: 1, kind: "decoy" as const, x: 0.5, y: 0.2, speed: 0.2 }],
    };

    const result = clickFallingObject(playing, 1);

    expect(result.score).toBe(0);
    expect(result.health).toBe(2);
  });

  /** Таймер ограничивает длительность игры и завершает её по истечении времени. */
  it("ends the game when the timer runs out", () => {
    const result = advanceGame(startGame(), GAME_DURATION_MS, () => 0.5);

    expect(result.status).toBe("over");
    expect(result.elapsedMs).toBe(GAME_DURATION_MS);
  });

  /** Более высокий уровень увеличивает скорость фигур и частоту их появления. */
  it("increases object speed and spawn frequency over time", () => {
    const random = () => 0.5;
    const early = advanceGame(startGame(), 1, random);
    const later = advanceGame(
      { ...startGame(), elapsedMs: 20_000, nextSpawnAtMs: 20_000 },
      1,
      random,
    );

    expect(getDifficultyLevel(20_000)).toBe(2);
    expect(later.objects[0].speed).toBeGreaterThan(early.objects[0].speed);
    expect(later.nextSpawnAtMs - 20_000).toBeLessThan(early.nextSpawnAtMs);
  });

  /** Результат симуляции соответствует прошедшему времени, а не числу кадров. */
  it("moves objects according to elapsed time rather than frame count", () => {
    const random = () => 0.5;
    const oneFrame = advanceGame(startGame(), 1_000, random);
    let sixtyFrames = startGame();
    for (let frame = 0; frame < 60; frame += 1) {
      sixtyFrames = advanceGame(sixtyFrames, 1_000 / 60, random);
    }

    expect(sixtyFrames.objects).toHaveLength(oneFrame.objects.length);
    expect(sixtyFrames.objects[0].y).toBeCloseTo(oneFrame.objects[0].y, 5);
  });

  /** До старта игровое состояние остаётся неизменным при обновлении. */
  it("does not advance a game that has not started", () => {
    const ready = createGameState();
    expect(advanceGame(ready, 1)).toBe(ready);
  });
});
