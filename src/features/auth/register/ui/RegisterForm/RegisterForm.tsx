import { zodResolver } from '@hookform/resolvers/zod';
import { ApiClientError } from "@/shared/lib/server/apiClient/api-client-error";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from 'react-hook-form';
import { REGISTER_SCHEMA } from "../../model/const/registerSchema";
import { RegisterFormData } from "../../model/types/registerTypes";
import { registerRequest } from "../../server/registerRequest";
import { useTranslations } from "next-intl";

export function RegisterForm() {
  const [serverError, setServerError] = useState<string | null>(null);
  const t = useTranslations("auth");
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(REGISTER_SCHEMA),
  });
  const router = useRouter();

  const onSubmit = async (data: RegisterFormData) => {
    setServerError(null);

    try {
      await registerRequest(data);
      router.replace("/dashboard");
    } catch (error) {
      const message =
        error instanceof ApiClientError && error.code === "EMAIL_ALREADY_EXISTS"
          ? t("errors.emailAlreadyExists")
          : t("errors.registerFailed");
      setServerError(message);
    }
  };

  return (
    <div className="w-full p-6 sm:p-8">
      <p className="mb-2 text-center text-xs font-semibold uppercase tracking-[0.2em] text-indigo-600 dark:text-indigo-300">{t("registerEyebrow")}</p>
      <h2 className="mb-7 text-center text-2xl font-bold tracking-tight text-slate-900 dark:text-white">{t("register")}</h2>

      <form noValidate onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label htmlFor="name" className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-200">
            {t("name")}
          </label>
          <input
            id="name"
            type="text"
            required
            {...register('name')}
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? "name-error" : undefined}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:border-transparent ${
              errors.name
                ? "border-red-500 focus:ring-red-500"
                : "border-slate-300 focus:ring-indigo-500 dark:border-slate-600 dark:bg-slate-800 dark:text-white"
            }`}
            placeholder={t("namePlaceholder")}
          />
          {errors.name && (
            <p id="name-error" role="alert" className="mt-1 text-sm text-red-600">
              {errors.name.message?.startsWith("auth.validation.")
                ? t(errors.name.message.slice("auth.".length))
                : t("validation.nameRequired")}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-200">
            {t("email")}
          </label>
          <input
            id="email"
            type="email"
            required
            {...register('email')}
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? "email-error" : undefined}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:border-transparent ${
              errors.email
                ? "border-red-500 focus:ring-red-500"
                : "border-slate-300 focus:ring-indigo-500 dark:border-slate-600 dark:bg-slate-800 dark:text-white"
            }`}
            placeholder={t("emailPlaceholder")}
          />
          {errors.email && (
            <p id="email-error" role="alert" className="mt-1 text-sm text-red-600">
              {errors.email.message?.startsWith("auth.validation.")
                ? t(errors.email.message.slice("auth.".length))
                : t("validation.emailInvalid")}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-200">
            {t("password")}
          </label>
          <input
            id="password"
            type="password"
            required
            {...register('password')}
            aria-invalid={Boolean(errors.password)}
            aria-describedby={errors.password ? "password-error" : undefined}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:border-transparent ${
              errors.password
                ? "border-red-500 focus:ring-red-500"
                : "border-slate-300 focus:ring-indigo-500 dark:border-slate-600 dark:bg-slate-800 dark:text-white"
            }`}
            placeholder={t("passwordPlaceholder")}
          />
          {errors.password && (
            <p id="password-error" role="alert" className="mt-1 text-sm text-red-600">
              {errors.password.message?.startsWith("auth.validation.")
                ? t(errors.password.message.slice("auth.".length))
                : t("validation.passwordRequired")}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="confirmPassword" className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-200">
            {t("confirmPassword")}
          </label>
          <input
            id="confirmPassword"
            type="password"
            required
            {...register('confirmPassword')}
            aria-invalid={Boolean(errors.confirmPassword)}
            aria-describedby={errors.confirmPassword ? "confirm-password-error" : undefined}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:border-transparent ${
              errors.confirmPassword
                ? "border-red-500 focus:ring-red-500"
                : "border-slate-300 focus:ring-indigo-500 dark:border-slate-600 dark:bg-slate-800 dark:text-white"
            }`}
            placeholder={t("confirmPasswordPlaceholder")}
          />
          {errors.confirmPassword && (
            <p id="confirm-password-error" role="alert" className="mt-1 text-sm text-red-600">
              {errors.confirmPassword.message?.startsWith("auth.validation.")
                ? t(errors.confirmPassword.message.slice("auth.".length))
                : t("validation.confirmPasswordRequired")}
            </p>
          )}
        </div>

        {serverError && (
          <p role="alert" className="text-sm text-red-600">
            {serverError}
          </p>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-xl bg-indigo-600 px-4 py-3 font-semibold text-white shadow-lg shadow-indigo-950/10 transition-colors hover:bg-indigo-700 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-indigo-300 disabled:cursor-not-allowed disabled:opacity-50 dark:focus-visible:ring-indigo-900"
        >
          {isSubmitting ? t("registerSubmitting") : t("registerSubmit")}
        </button>
      </form>
    </div>
  );
}