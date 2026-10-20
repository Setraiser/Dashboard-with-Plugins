import type { IUser } from "@/shared/lib/types/user";
import { logout } from "../../server/logout";
import { useTranslations } from "next-intl";
import { LanguageSwitcher } from "../LanguageSwitcher/LanguageSwitcher";

interface UserMenuProps {
  user: IUser;
}

export function UserMenu({ user }: UserMenuProps) {
  const t = useTranslations("common");

  return (
    <div className="flex items-center justify-between gap-4 sm:justify-end">
      <LanguageSwitcher />
      <span className="truncate text-sm font-medium text-[#494a43] dark:text-[#d5d4cb]">
        {user.name}
      </span>
      <form action={logout}>
        <button
          type="submit"
          className="rounded-sm border border-[#c9c5ba] px-3 py-1.5 text-sm font-medium text-[#494a43] transition-colors hover:border-[#a34d36] hover:text-[#8d4935] dark:border-[#55574e] dark:text-[#d5d4cb] dark:hover:border-[#d18468] dark:hover:text-[#e4aa91]"
        >
          {t("logout")}
        </button>
      </form>
    </div>
  );
}
