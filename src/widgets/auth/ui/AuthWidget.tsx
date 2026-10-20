"use client";
import { LoginForm, RegisterForm } from "@/features/auth";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { AuthMode } from "../model/types/auth";

export function AuthWidget() {
  const [mode, setMode] = useState<AuthMode>("login");
  const t = useTranslations("auth");

  return (
    <div className="mx-auto w-full max-w-md overflow-hidden rounded-md border border-[#d9d5ca] bg-[#fbfaf6] dark:border-[#45473f] dark:bg-[#20231e]">
      <div className="border-b border-[#d9d5ca] dark:border-[#45473f]">
        <div className="flex">
        <button
          type="button"
          onClick={() => setMode("login")}
          className={`flex-1 border-b-2 px-4 py-3 text-sm font-semibold transition-colors ${mode === "login"
            ? "border-[#a34d36] text-[#8d4935] dark:border-[#d18468] dark:text-[#e4aa91]"
            : "border-transparent text-[#77786f] hover:text-[#282923] dark:text-[#a4a59b] dark:hover:text-[#f0eee7]"
            }`}
        >
          {t("login")}
        </button>
        <button
          type="button"
          onClick={() => setMode("register")}
          className={`flex-1 border-b-2 px-4 py-3 text-sm font-semibold transition-colors ${mode === "register"
            ? "border-[#a34d36] text-[#8d4935] dark:border-[#d18468] dark:text-[#e4aa91]"
            : "border-transparent text-[#77786f] hover:text-[#282923] dark:text-[#a4a59b] dark:hover:text-[#f0eee7]"
            }`}
        >
          {t("register")}
        </button>
        </div>
      </div>

      <div className="overflow-hidden">
        <div className="transition-all duration-300 ease-in-out">
          {mode === "login" ? <LoginForm /> : <RegisterForm />}
        </div>
      </div>
    </div>
  );
}