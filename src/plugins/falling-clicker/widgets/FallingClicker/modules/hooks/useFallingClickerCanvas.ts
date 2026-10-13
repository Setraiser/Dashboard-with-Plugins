"use client";

import { Application, Container, Graphics } from "pixi.js";
import { useEffect, useRef } from "react";
import {
  advanceGame,
  clickFallingObject,
  startGame,
  type GameState,
} from "../../../../entities/game";

interface UseFallingClickerCanvasOptions {
  /** Получает актуальное состояние игры для обновления React-интерфейса. */
  onGameChange: (state: GameState) => void;
  /** Вызывается, если Pixi renderer не удалось инициализировать. */
  onCanvasError: () => void;
}

/**
 * Подключает игровой цикл Pixi.js к DOM-контейнеру и возвращает ref контейнера.
 *
 * Движение объектов и рендеринг выполняются внутри Pixi ticker; React получает
 * обновления состояния реже, чтобы не перерисовывать интерфейс на каждом кадре.
 */
export function useFallingClickerCanvas({
  onGameChange,
  onCanvasError,
}: UseFallingClickerCanvasOptions) {
  const containerRef = useRef<HTMLDivElement>(null);
  const onGameChangeRef = useRef(onGameChange);
  const onCanvasErrorRef = useRef(onCanvasError);

  // Ticker использует ref, чтобы вызывать последние обработчики без перезапуска Pixi.
  useEffect(() => {
    onGameChangeRef.current = onGameChange;
    onCanvasErrorRef.current = onCanvasError;
  }, [onCanvasError, onGameChange]);

  useEffect(() => {
    const hostElement = containerRef.current;
    if (!hostElement) return;

    const app = new Application();
    const objectsLayer = new Container();
    const graphicsById = new Map<number, Graphics>();
    const gameRef = { current: startGame() };
    let cancelled = false;
    let initialized = false;
    let lastUiUpdate = 0;

    // Сохраняем Graphics между кадрами: создаём их только для новых объектов.
    function syncObjects(state: GameState) {
      const liveIds = new Set(state.objects.map(({ id }) => id));
      for (const [id, graphic] of graphicsById) {
        if (!liveIds.has(id)) {
          objectsLayer.removeChild(graphic);
          graphic.destroy();
          graphicsById.delete(id);
        }
      }

      const width = app.renderer.width / app.renderer.resolution;
      const height = app.renderer.height / app.renderer.resolution;
      for (const object of state.objects) {
        let graphic = graphicsById.get(object.id);
        if (!graphic) {
          graphic = new Graphics();
          if (object.kind === "target") {
            graphic
              .star(0, 0, 5, 23, 11)
              .fill({ color: 0xfacc15 })
              .stroke({ color: 0x854d0e, width: 2 });
          } else {
            graphic
              .roundRect(-17, -17, 34, 34, 6)
              .fill({ color: 0xf43f5e })
              .stroke({ color: 0x881337, width: 2 });
          }
          graphic.eventMode = "static";
          graphic.cursor = "pointer";
          graphic.on("pointertap", () => {
            gameRef.current = clickFallingObject(gameRef.current, object.id);
            onGameChangeRef.current(gameRef.current);
            if (gameRef.current.status === "over") app.ticker.stop();
          });
          graphicsById.set(object.id, graphic);
          objectsLayer.addChild(graphic);
        }

        graphic.position.set(object.x * width, object.y * height);
      }
    }

    // Инициализация Pixi асинхронна, поэтому cleanup учитывает её завершение.
    async function initialize(element: HTMLDivElement) {
      try {
        await app.init({
          resizeTo: element,
          backgroundAlpha: 0,
          antialias: true,
          autoDensity: true,
          resolution: Math.min(window.devicePixelRatio || 1, 2),
        });
        initialized = true;

        if (cancelled) {
          app.destroy(true, true);
          return;
        }

        app.canvas.className = "block h-full w-full";
        element.appendChild(app.canvas);
        app.stage.addChild(objectsLayer);

        app.ticker.add((ticker) => {
          const nextState = advanceGame(gameRef.current, ticker.deltaMS);
          gameRef.current = nextState;
          syncObjects(nextState);

          if (
            nextState.status === "over" ||
            ticker.lastTime - lastUiUpdate >= 150
          ) {
            lastUiUpdate = ticker.lastTime;
            onGameChangeRef.current(nextState);
          }

          if (nextState.status === "over") app.ticker.stop();
        });
      } catch (error: unknown) {
        if (!cancelled) {
          console.error("Falling Clicker renderer failed to initialize.", error);
          onCanvasErrorRef.current();
        }
      }
    }

    void initialize(hostElement);

    return () => {
      cancelled = true;
      graphicsById.clear();
      // Если init ещё не завершился, initialize уничтожит приложение после await.
      if (initialized) {
        app.ticker.stop();
        app.destroy(true, true);
      }
    };
  }, []);

  return containerRef;
}
