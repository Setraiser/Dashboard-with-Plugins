import {
  QueryClient,
  type QueryClientConfig,
} from "@tanstack/react-query";

// Базовые настройки для всех
const baseConfig: QueryClientConfig = {
  defaultOptions: {
    queries: {
      staleTime: 30_000, // 30 секунд
      refetchOnWindowFocus: false,
    },
  },
};

let browserQueryClient: QueryClient | undefined = undefined;

export function getQueryClient() {
  if (typeof window === 'undefined') {
    // СЕРВЕР: 
    // Добавляем retry: 0 или 1, чтобы не задерживать SSR при ошибках сети
    const serverConfig: QueryClientConfig = {
      ...baseConfig,
      defaultOptions: {
        ...baseConfig.defaultOptions,
        queries: {
          ...baseConfig.defaultOptions?.queries,
          retry: 1, // Или 0, чтобы падать сразу
        },
      },
    };
    return new QueryClient(serverConfig);
  } 
  
  // КЛИЕНТ:
  if (!browserQueryClient) {
    // На клиенте можно оставить retry: 3 (по умолчанию) или задать явно
    browserQueryClient = new QueryClient(baseConfig);
  }
  
  return browserQueryClient;
}