"use client"
// AuthWidget.tsx
import { LoginForm, RegisterForm } from "@/features/auth";
import { useState } from 'react';
import { AuthMode } from "../model/types/auth";

export function AuthWidget() {
  const [mode, setMode] = useState<AuthMode>('login');

  return (
    <div className="mx-auto w-full max-w-md overflow-hidden rounded-3xl border border-white/80 bg-white/80 shadow-2xl shadow-indigo-950/10 backdrop-blur dark:border-slate-700/70 dark:bg-slate-900/75">
      <div className="border-b border-slate-200/80 p-2 dark:border-slate-700/80">
        <div className="flex rounded-2xl bg-slate-100/80 p-1 dark:bg-slate-800/80">
        <button
          type="button"
          onClick={() => setMode('login')}
          className={`flex-1 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all ${mode === 'login'
            ? 'bg-white text-indigo-700 shadow-sm dark:bg-slate-700 dark:text-indigo-200'
            : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white'
            }`}
        >
          Вход
        </button>
        <button
          type="button"
          onClick={() => setMode('register')}
          className={`flex-1 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all ${mode === 'register'
            ? 'bg-white text-indigo-700 shadow-sm dark:bg-slate-700 dark:text-indigo-200'
            : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white'
            }`}
        >
          Регистрация
        </button>
        </div>
      </div>

      <div className="overflow-hidden">
        <div className="transition-all duration-300 ease-in-out">
          {mode === 'login' ? <LoginForm /> : <RegisterForm />}
        </div>
      </div>
    </div>
  );
}