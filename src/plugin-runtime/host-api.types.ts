import type { PluginPermission } from "./types";

export interface HostApiUser {
  id: string;
  role: string;
}

export interface HostApiOptions {
  getUser: () => HostApiUser | null;
  hasPermission: (permission: PluginPermission) => boolean;
  navigate: (href: string) => void;
}
