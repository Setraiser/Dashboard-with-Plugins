"use client";

import { useEffect, useRef, useState } from "react";
import type { FallingClickerApi } from "../../../../types/falling-clicker-api";
import { calculateScore, type GameState } from "../../../../entities/game";

/** Безопасно извлекает код ошибки API, не предполагая конкретный класс ошибки. */
function getApiErrorCode(error: unknown): string | null {
  if (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    typeof error.code === "string"
  ) {
    return error.code;
  }
  return null;
}

/**
 * Загружает рекорд и отправляет результат завершённого запуска игры.
 *
 * @param api Реализация API рекордов, предоставленная хостом плагина.
 * @param game Актуальное состояние игры.
 * @param runId Идентификатор запуска для однократной отправки результата.
 * @param saveFailedMessage Локализованное сообщение для обычных ошибок API.
 */
export function useBestScore(
  api: FallingClickerApi,
  game: GameState,
  runId: number,
  saveFailedMessage: string,
) {
  const [bestScore, setBestScore] = useState<number | null>(null);
  const [bestScoreLoaded, setBestScoreLoaded] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [scoreNotSaved, setScoreNotSaved] = useState(false);
  const submittedRunId = useRef<number | null>(null);

  // Флаг отмены не даёт обновить состояние компонента после размонтирования.
  useEffect(() => {
    let cancelled = false;
    api
      .getBestScore()
      .then((score) => {
        if (!cancelled) setBestScore(score);
      })
      .catch((error: unknown) => {
        if (!cancelled && getApiErrorCode(error) !== "SESSION_EXPIRED") {
          setSaveError(saveFailedMessage);
        }
      })
      .finally(() => {
        if (!cancelled) setBestScoreLoaded(true);
      });

    return () => {
      cancelled = true;
    };
  }, [api, saveFailedMessage]);

  useEffect(() => {
    // Состояние меняется на каждом кадре; отправляем результат только один раз за запуск.
    if (game.status !== "over" || submittedRunId.current === runId) return;

    submittedRunId.current = runId;
    let cancelled = false;
    setSaving(true);
    api
      .submitScore(calculateScore(game))
      .then((score) => {
        if (!cancelled) setBestScore(score);
      })
      .catch((error: unknown) => {
        if (cancelled) return;
        if (getApiErrorCode(error) === "SESSION_EXPIRED") {
          setScoreNotSaved(true);
          return;
        }
        setSaveError(saveFailedMessage);
      })
      .finally(() => {
        if (!cancelled) setSaving(false);
      });

    return () => {
      cancelled = true;
    };
  }, [api, game, runId, saveFailedMessage]);

  /** Сбрасывает временные сообщения и индикатор предыдущего сохранения перед новой игрой. */
  function resetSaveState() {
    setSaveError(null);
    setScoreNotSaved(false);
    setSaving(false);
  }

  return {
    bestScore,
    bestScoreLoaded,
    saving,
    saveError,
    scoreNotSaved,
    resetSaveState,
  };
}
