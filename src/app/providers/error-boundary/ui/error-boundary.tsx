"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";

type Props = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function Error({
  error,
  reset,
}: Props) {
  const t = useTranslations("runtime");

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div>
      <h2>{t("applicationError")}</h2>

      <button type="button" onClick={reset}>
        {t("retry")}
      </button>
    </div>
  );
}