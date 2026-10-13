/** Контракт запросов рекорда, который хост передаёт игровому виджету. */
export interface FallingClickerApi {
  /** Возвращает сохранённый рекорд или null, если запусков ещё не было. */
  getBestScore(): Promise<number | null>;
  /** Сохраняет счёт завершённого запуска и возвращает актуальный рекорд. */
  submitScore(score: number): Promise<number>;
}

/** Зависимости плагина, предоставляемые plugin host. */
export interface FallingClickerDependencies {
  fallingClickerApi: FallingClickerApi;
}
