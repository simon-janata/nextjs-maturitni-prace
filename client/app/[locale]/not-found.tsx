"use client";

import NotFound from "@/components/NotFound";
import { useDocumentTitle } from "@mantine/hooks";
import { useLocale, useTranslations } from "next-intl";

export default function NotFoundPage() {
  useDocumentTitle("Not found");
  const locale = useLocale();
  const t = useTranslations("NotFoundPage");
  
  return (
    <NotFound
      title={t("title")}
      text={t("text")}
      buttonAddress={`/${locale}`}
      buttonText={t("buttonText")}
    />
  );
}
