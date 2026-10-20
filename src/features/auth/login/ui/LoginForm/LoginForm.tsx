import { zodResolver } from '@hookform/resolvers/zod';
import { ApiClientError } from "@/shared/lib/server/apiClient/api-client-error";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from 'react-hook-form';
import { LOGIN_SCHEMA, LoginFormData } from "../../model/const/loginSchema";
import { loginRequest } from "../../server/loginRequest";
import { useTranslations } from "next-intl";

export function LoginForm() {
  const [serverError, setServerError] = useState<string | null>(null);
  const t = useTranslations("auth");
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(LOGIN_SCHEMA),
  });

  const router = useRouter();

  const onSubmit = async (data: LoginFormData) => {
    setServerError(null);

    try {
      await loginRequest(data);
      router.replace("/dashboard");
    } catch (error) {
      const message =
        error instanceof ApiClientError && error.code === "INVALID_CREDENTIALS"
          ? t("errors.invalidCredentials")
          : t("errors.loginFailed");
      setServerError(message);
    }
  };

  return (
    <div className="w-full p-6 sm:p-8">
      <p className="mb-2 text-center text-xs font-semibold tracking-[0.1em] text-[#8d4935] dark:text-[#d18468]">{t("loginEyebrow")}</p>
      <h2 className="mb-7 text-center font-serif text-3xl font-medium tracking-tight text-[#282923] dark:text-[#f0eee7]">{t("login")}</h2>

      <form noValidate onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-[#494a43] dark:text-[#d5d4cb]">
            {t("email")}
          </label>
          <input
            id="email"
            type="email"
            required
            {...register('email')}
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? "email-error" : undefined}
            className={`w-full rounded-sm border bg-white px-3 py-2 text-[#282923] focus:outline-none focus:ring-2 focus:border-transparent dark:bg-[#171916] dark:text-[#f0eee7] ${errors.email
              ? "border-red-500 focus:ring-red-500"
              : "border-[#c9c5ba] focus:ring-[#a34d36] dark:border-[#55574e] dark:focus:ring-[#d18468]"
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
          <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-[#494a43] dark:text-[#d5d4cb]">
            {t("password")}
          </label>
          <input
            id="password"
            type="password"
            required
            {...register('password')}
            aria-invalid={Boolean(errors.password)}
            aria-describedby={errors.password ? "password-error" : undefined}
            className={`w-full rounded-sm border bg-white px-3 py-2 text-[#282923] focus:outline-none focus:ring-2 focus:border-transparent dark:bg-[#171916] dark:text-[#f0eee7] ${errors.password
              ? "border-red-500 focus:ring-red-500"
              : "border-[#c9c5ba] focus:ring-[#a34d36] dark:border-[#55574e] dark:focus:ring-[#d18468]"
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

        {serverError && (
          <p role="alert" className="text-sm text-red-600">
            {serverError}
          </p>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-sm bg-[#a34d36] px-4 py-3 font-semibold text-white transition-colors hover:bg-[#873e2c] disabled:cursor-not-allowed disabled:opacity-50 dark:bg-[#a8583e] dark:hover:bg-[#bb684c]"
        >
          {isSubmitting ? t("loginSubmitting") : t("loginSubmit")}
        </button>
      </form>
    </div>
  );
}