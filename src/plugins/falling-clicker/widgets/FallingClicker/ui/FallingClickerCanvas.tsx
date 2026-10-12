"use client";

import type { GameState } from "../../../entities/game";
import { useFallingClickerCanvas } from "../modules/hooks/useFallingClickerCanvas";

interface FallingClickerCanvasProps {
  /** Передаёт состояние игры из Pixi в родительский виджет. */
  onGameChange: (state: GameState) => void;
  /** Сообщает родителю об ошибке инициализации игрового canvas. */
  onCanvasError: () => void;
  /** Доступное имя игровой области. */
  label: string;
}

/** DOM-обёртка игровой сцены; Pixi lifecycle реализован в useFallingClickerCanvas. */
export function FallingClickerCanvas({
  onGameChange,
  onCanvasError,
  label,
}: FallingClickerCanvasProps) {
  const containerRef = useFallingClickerCanvas({ onGameChange, onCanvasError });

  return (
    <div
      ref={containerRef}
      className="h-[min(60vh,32rem)] min-h-72 w-full overflow-hidden rounded-2xl bg-slate-950/90"
      aria-label={label}
    />
  );
}
