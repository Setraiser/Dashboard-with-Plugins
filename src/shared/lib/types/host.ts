export type PluginRequest = <T>(
  url: string,
  options?: RequestInit
) => Promise<T>;

export interface PluginHostApi {
  request: PluginRequest;
  navigate: (href: string) => void;
}

export enum PluginId {
  Todo = "todo",
  Clock = "clock",
}
