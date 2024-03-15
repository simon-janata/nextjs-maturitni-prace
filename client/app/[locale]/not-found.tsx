"use client";

import { useLocale, useTranslations } from "next-intl";

import NotFound from "@/components/NotFound";
import { useDocumentTitle } from "@mantine/hooks";

export default function NotFoundPage() {
  const t = useTranslations("NotFoundPage");
  useDocumentTitle(`${t("tabTitle")}`);
  const locale = useLocale();

  return (
    <NotFound
      title={t("title")}
      text={t("text")}
      buttonAddress={`/${locale}`}
      buttonText={t("buttonText")}
    />
  );
}
