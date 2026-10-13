import type { FallingClickerDependencies } from "../../types/falling-clicker-api";

/**
 * Проверяет форму неизвестного объекта до передачи зависимостей в виджет.
 * Проверяет вызываемость методов, не исполняя сетевые запросы.
 */
export function isFallingClickerDependencies(
  value: unknown,
): value is FallingClickerDependencies {
  if (typeof value !== "object" || value === null || !("fallingClickerApi" in value)) {
    return false;
  }

  const api = value.fallingClickerApi;
  return (
    typeof api === "object" &&
    api !== null &&
    "getBestScore" in api &&
    typeof api.getBestScore === "function" &&
    "submitScore" in api &&
    typeof api.submitScore === "function"
  );
}
