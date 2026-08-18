"use client"
// AuthWidget.tsx
import { LoginForm, RegisterForm } from "@/features/auth";
import { useState } from 'react';
import { AuthMode } from "../model/types/auth";

export function AuthWidget() {
  const [mode, setMode] = useState<AuthMode>('login');

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Tabs */}
      <div className="flex bg-gray-100 rounded-t-lg p-1 mb-0">
        <button
          onClick={() => setMode('login')}
          className={`flex-1 py-2 px-4 rounded-md font-medium transition-all ${mode === 'login'
            ? 'bg-white text-blue-600 shadow-sm'
            : 'text-gray-600 hover:text-gray-800'
            }`}
        >
          Вход
        </button>
        <button
          onClick={() => setMode('register')}
          className={`flex-1 py-2 px-4 rounded-md font-medium transition-all ${mode === 'register'
            ? 'bg-white text-green-600 shadow-sm'
            : 'text-gray-600 hover:text-gray-800'
            }`}
        >
          Регистрация
        </button>
      </div>

      {/* Form Container */}
      <div className="bg-white rounded-b-lg shadow-md overflow-hidden">
        <div className="transition-all duration-300 ease-in-out">
          {mode === 'login' ? <LoginForm /> : <RegisterForm />}
        </div>
      </div>
    </div>
  );
}