import { apiClient } from "../../server/apiClient/apiClient";
import { PluginHostApi } from "../../types/host";

export function createPluginHostApi(
  options: {
    navigate?: (href: string) => void;
  } = {}
): PluginHostApi {
  return {
    navigate:
      options.navigate ??
      ((href) => {
        window.location.assign(href);
      }),
    request: apiClient,
  };
}
