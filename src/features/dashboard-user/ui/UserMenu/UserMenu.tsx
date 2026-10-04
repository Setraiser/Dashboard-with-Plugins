import type { IUser } from "@/shared/lib/types/user";
import { logout } from "../../server/logout";

interface UserMenuProps {
  user: IUser;
}

export function UserMenu({ user }: UserMenuProps) {
  return (
    <div className="flex items-center justify-between gap-4 sm:justify-end">
      <span className="truncate text-sm font-medium text-slate-700 dark:text-slate-200">
        {user.name}
      </span>
      <form action={logout}>
        <button
          type="submit"
          className="rounded-md border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-800"
        >
          Выйти
        </button>
      </form>
    </div>
  );
}
