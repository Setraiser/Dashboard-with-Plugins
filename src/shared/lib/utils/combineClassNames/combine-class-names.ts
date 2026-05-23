import { ClassNameArg } from "./types";


/**
 * Собирает строку `className`: строки пропускаются как есть,
 * из объектов берутся ключи с истинным значением (удобно для модификаторов CSS Modules).
 */
export function combineClassNames(...args: ClassNameArg[]): string {
  const parts: string[] = [];

  for (const arg of args) {
    if (!arg) continue;
    if (typeof arg === "string") {
      parts.push(arg);
      continue;
    }
    for (const [cls, on] of Object.entries(arg)) {
      if (on) parts.push(cls);
    }
  }

  return parts.join(" ");
}
