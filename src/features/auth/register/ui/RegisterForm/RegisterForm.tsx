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
      <p className="mb-2 text-center text-xs font-semibold tracking-[0.1em] text-[#8d4935] dark:text-[#d18468]">{t("registerEyebrow")}</p>
      <h2 className="mb-7 text-center font-serif text-3xl font-medium tracking-tight text-[#282923] dark:text-[#f0eee7]">{t("register")}</h2>

      <form noValidate onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label htmlFor="name" className="mb-1.5 block text-sm font-medium text-[#494a43] dark:text-[#d5d4cb]">
            {t("name")}
          </label>
          <input
            id="name"
            type="text"
            required
            {...register('name')}
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? "name-error" : undefined}
            className={`w-full rounded-sm border bg-white px-3 py-2 text-[#282923] focus:outline-none focus:ring-2 focus:border-transparent dark:bg-[#171916] dark:text-[#f0eee7] ${
              errors.name
                ? "border-red-500 focus:ring-red-500"
                : "border-[#c9c5ba] focus:ring-[#a34d36] dark:border-[#55574e] dark:focus:ring-[#d18468]"
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
            className={`w-full rounded-sm border bg-white px-3 py-2 text-[#282923] focus:outline-none focus:ring-2 focus:border-transparent dark:bg-[#171916] dark:text-[#f0eee7] ${
              errors.email
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
            className={`w-full rounded-sm border bg-white px-3 py-2 text-[#282923] focus:outline-none focus:ring-2 focus:border-transparent dark:bg-[#171916] dark:text-[#f0eee7] ${
              errors.password
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

        <div>
          <label htmlFor="confirmPassword" className="mb-1.5 block text-sm font-medium text-[#494a43] dark:text-[#d5d4cb]">
            {t("confirmPassword")}
          </label>
          <input
            id="confirmPassword"
            type="password"
            required
            {...register('confirmPassword')}
            aria-invalid={Boolean(errors.confirmPassword)}
            aria-describedby={errors.confirmPassword ? "confirm-password-error" : undefined}
            className={`w-full rounded-sm border bg-white px-3 py-2 text-[#282923] focus:outline-none focus:ring-2 focus:border-transparent dark:bg-[#171916] dark:text-[#f0eee7] ${
              errors.confirmPassword
                ? "border-red-500 focus:ring-red-500"
                : "border-[#c9c5ba] focus:ring-[#a34d36] dark:border-[#55574e] dark:focus:ring-[#d18468]"
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
          className="w-full rounded-sm bg-[#a34d36] px-4 py-3 font-semibold text-white transition-colors hover:bg-[#873e2c] disabled:cursor-not-allowed disabled:opacity-50 dark:bg-[#a8583e] dark:hover:bg-[#bb684c]"
        >
          {isSubmitting ? t("registerSubmitting") : t("registerSubmit")}
        </button>
      </form>
    </div>
  );
}