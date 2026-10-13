import {
  DIFFICULTY_INTERVAL_MS,
  GAME_DURATION_MS,
  INITIAL_HEALTH,
  TARGET_SCORE,
} from "../const/game-logic";
import type { FallingObject, GameState } from "../types/game-state";

/** Интервал появления фигур на начальном уровне, в миллисекундах. */
const INITIAL_SPAWN_INTERVAL_MS = 1_100;
/** На сколько миллисекунд сокращается интервал при каждом уровне. */
const SPAWN_INTERVAL_DECREASE_MS = 125;
/** Нижний предел интервала появления фигур, в миллисекундах. */
const MIN_SPAWN_INTERVAL_MS = 350;
/** Начальная скорость падения в высотах поля за секунду. */
const INITIAL_OBJECT_SPEED = 0.18;
/** Прибавка скорости на каждом уровне сложности. */
const OBJECT_SPEED_INCREASE = 0.04;

/** Создаёт исходное состояние игры до её запуска. */
export function createGameState(): GameState {
  return {
    status: "ready",
    elapsedMs: 0,
    score: 0,
    health: INITIAL_HEALTH,
    objects: [],
    nextObjectId: 0,
    nextSpawnAtMs: 0,
  };
}

/** Переводит новую игру в состояние активной. */
export function startGame(): GameState {
  return { ...createGameState(), status: "playing" };
}

/**
 * Возвращает уровень сложности для указанного времени с начала игры.
 * Отрицательное время считается нулевым.
 */
export function getDifficultyLevel(elapsedMs: number): number {
  return Math.floor(Math.max(0, elapsedMs) / DIFFICULTY_INTERVAL_MS);
}

/** Рассчитывает интервал появления с учётом минимального ограничения. */
function getSpawnInterval(level: number): number {
  return Math.max(
    MIN_SPAWN_INTERVAL_MS,
    INITIAL_SPAWN_INTERVAL_MS - level * SPAWN_INTERVAL_DECREASE_MS,
  );
}

/** Рассчитывает скорость падения фигуры для уровня сложности. */
function getObjectSpeed(level: number): number {
  return INITIAL_OBJECT_SPEED + level * OBJECT_SPEED_INCREASE;
}

/**
 * Продвигает игровую симуляцию на заданное время.
 *
 * Объекты используют нормализованные координаты: скорость по вертикали
 * измеряется в высотах игрового поля в секунду.
 *
 * @param state Текущее состояние игры.
 * @param deltaMs Время с предыдущего обновления в миллисекундах.
 * @param random Источник случайных чисел в диапазоне [0, 1), заменяемый в тестах.
 * @returns Новое состояние игры; завершённое или неактивное состояние не меняется.
 */
export function advanceGame(
  state: GameState,
  deltaMs: number,
  random: () => number = Math.random,
): GameState {
  if (state.status !== "playing" || deltaMs <= 0) return state;

  const elapsedMs = Math.min(state.elapsedMs + deltaMs, GAME_DURATION_MS);
  const seconds = deltaMs / 1_000;
  const objects = state.objects
    .map((object) => ({ ...object, y: object.y + object.speed * seconds }))
    .filter((object) => object.y <= 1.1);
  let nextObjectId = state.nextObjectId;
  let nextSpawnAtMs = state.nextSpawnAtMs;

  // Создаём все объекты, появление которых пришлось на этот временной шаг.
  // Позиция учитывает время с момента появления, чтобы результат не зависел от FPS.
  while (nextSpawnAtMs <= elapsedMs && nextSpawnAtMs < GAME_DURATION_MS) {
    const level = getDifficultyLevel(nextSpawnAtMs);
    const speed = getObjectSpeed(level);
    const ageSeconds = (elapsedMs - nextSpawnAtMs) / 1_000;
    const object: FallingObject = {
      id: nextObjectId++,
      // Цели встречаются чаще приманок, а координата X не подходит вплотную к краям.
      kind: random() < 0.7 ? "target" : "decoy",
      x: 0.08 + random() * 0.84,
      y: speed * ageSeconds,
      speed,
    };
    if (object.y <= 1.1) objects.push(object);
    nextSpawnAtMs += getSpawnInterval(level);
  }

  return {
    ...state,
    status: elapsedMs >= GAME_DURATION_MS ? "over" : "playing",
    elapsedMs,
    objects,
    nextObjectId,
    nextSpawnAtMs,
  };
}

/**
 * Применяет клик по объекту: начисляет очки за цель и снимает жизнь за приманку.
 * Неактивная игра и идентификатор отсутствующего объекта оставляют состояние без изменений.
 */
export function clickFallingObject(
  state: GameState,
  objectId: number,
): GameState {
  if (state.status !== "playing") return state;
  const clicked = state.objects.find((object) => object.id === objectId);
  if (!clicked) return state;

  const health =
    clicked.kind === "decoy" ? state.health - 1 : state.health;
  return {
    ...state,
    score: state.score + (clicked.kind === "target" ? TARGET_SCORE : 0),
    health,
    status: health <= 0 ? "over" : state.status,
    objects: state.objects.filter((object) => object.id !== objectId),
  };
}

/** Возвращает оставшееся игровое время в целых секундах, округлённых вверх. */
export function getRemainingSeconds(state: GameState): number {
  return Math.ceil(Math.max(0, GAME_DURATION_MS - state.elapsedMs) / 1_000);
}

/** Возвращает итоговый счёт игрока. */
export function calculateScore(state: GameState): number {
  return state.score;
}
