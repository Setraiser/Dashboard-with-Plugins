"use client";

import { useTranslations } from "next-intl";
import { useCallback, useState } from "react";
import type { FallingClickerApi } from "../../../types/falling-clicker-api";
import {
  calculateScore,
  createGameState,
  getRemainingSeconds,
  startGame,
  type GameState,
} from "../../../entities/game";
import { useBestScore } from "../../../features/best-score";
import { FallingClickerI18nProvider } from "../../../i18n/FallingClickerI18nProvider";
import { FallingClickerCanvas } from "./FallingClickerCanvas";

interface FallingClickerProps {
  /** API рекордов, предоставленный plugin host. */
  api: FallingClickerApi;
  /** Необязательная локаль интерфейса; неподдерживаемые варианты переключаются на английский. */
  locale?: string;
}

/** Собирает игровой экран из модели игры, feature рекорда и Pixi-сцены. */
function Game({ api }: { api: FallingClickerApi }) {
  const t = useTranslations("game");
  const [game, setGame] = useState(createGameState);
  const [runId, setRunId] = useState(0);
  const [canvasError, setCanvasError] = useState(false);
  const {
    bestScore,
    bestScoreLoaded,
    saving,
    saveError,
    scoreNotSaved,
    resetSaveState,
  } = useBestScore(api, game, runId, t("saveFailed"));

  const handleGameChange = useCallback((nextGame: GameState) => {
    setGame(nextGame);
  }, []);

  // При каждом старте меняем runId, чтобы feature могла отправить новый результат.
  const start = () => {
    setRunId((currentRunId) => currentRunId + 1);
    resetSaveState();
    setCanvasError(false);
    setGame(startGame());
  };

  return (
    <section className="mx-auto w-full max-w-3xl rounded-3xl border border-slate-200 bg-white p-4 shadow-xl shadow-slate-900/10 sm:p-6 dark:border-slate-700 dark:bg-slate-900">
      <header className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-xl font-bold text-slate-900 dark:text-white">
          Falling Clicker
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-300">
          {t("target")}
        </p>
      </header>

      <div className="mb-4 grid grid-cols-3 gap-2 text-center">
        <div className="rounded-xl bg-slate-100 px-2 py-3 dark:bg-slate-800">
          <div className="text-xs text-slate-500 dark:text-slate-400">{t("score")}</div>
          <div className="font-semibold tabular-nums">{game.score}</div>
        </div>
        <div className="rounded-xl bg-slate-100 px-2 py-3 dark:bg-slate-800">
          <div className="text-xs text-slate-500 dark:text-slate-400">{t("health")}</div>
          <div className="font-semibold tabular-nums">{game.health}</div>
        </div>
        <div className="rounded-xl bg-slate-100 px-2 py-3 dark:bg-slate-800">
          <div className="text-xs text-slate-500 dark:text-slate-400">{t("time")}</div>
          <div className="font-semibold tabular-nums">{getRemainingSeconds(game)}s</div>
        </div>
      </div>

      {game.status === "playing" && !canvasError && (
        <FallingClickerCanvas
          onGameChange={handleGameChange}
          onCanvasError={() => setCanvasError(true)}
          label={t("playArea")}
        />
      )}

      {game.status === "ready" && (
        <div className="flex min-h-72 flex-col items-center justify-center gap-5 rounded-2xl bg-slate-950 px-6 text-center text-white">
          <p className="max-w-md text-slate-200">{t("instructions")}</p>
          {bestScoreLoaded && (
            <p className="text-sm text-slate-300">
              {t("bestScore")}: {bestScore ?? "—"}
            </p>
          )}
          <button
            type="button"
            onClick={start}
            className="rounded-xl bg-indigo-500 px-6 py-3 font-semibold text-white transition hover:bg-indigo-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            {t("start")}
          </button>
        </div>
      )}

      {(game.status === "over" || canvasError) && (
        <div className="flex min-h-72 flex-col items-center justify-center gap-4 rounded-2xl bg-slate-950 px-6 text-center text-white">
          <h2 className="text-2xl font-bold">
            {canvasError ? t("canvasError") : t("gameOver")}
          </h2>
          {!canvasError && (
            <>
              <p>{t("score")}: {calculateScore(game)}</p>
              <p>
                {t("bestScore")}:{" "}
                {saving || !bestScoreLoaded ? "…" : bestScore ?? "—"}
              </p>
              {scoreNotSaved && (
                <p role="status" className="text-sm text-amber-200">
                  {t("scoreNotSaved")}
                </p>
              )}
              {saveError && (
                <p role="alert" className="text-sm text-rose-200">
                  {saveError}
                </p>
              )}
            </>
          )}
          <button
            type="button"
            onClick={start}
            className="rounded-xl bg-indigo-500 px-6 py-3 font-semibold text-white transition hover:bg-indigo-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            {t("playAgain")}
          </button>
        </div>
      )}
    </section>
  );
}

/** Публичный виджет игры с собственным провайдером локализации. */
export function FallingClicker({ api, locale }: FallingClickerProps) {
  return (
    <FallingClickerI18nProvider locale={locale}>
      <Game api={api} />
    </FallingClickerI18nProvider>
  );
}
