import { BreadcrumbItem } from "../types/breadcrumbs";

export function getBreadcrumbItems(
  pathname: string,
  pluginNames: Map<string, string>
): BreadcrumbItem[] {
  const segments = pathname.split("/").filter(Boolean);
  if (segments[0] !== "dashboard") return [];

  const items: BreadcrumbItem[] = [{ label: "Dashboard" }];
  if (segments[1]) {
    items[0].href = "/dashboard";
    const pluginId = segments[1];
    const fallbackLabel = pluginId
      .replace(/[-_]/g, " ")
      .replace(/\b\w/g, (character) => character.toUpperCase());

    items.push({ label: pluginNames.get(pluginId) ?? fallbackLabel });
  }

  return items;
}
