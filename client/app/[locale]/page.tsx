"use client";

import MainBanner from "@/components/MainBanner";
import { useDocumentTitle } from "@mantine/hooks";
import { useTranslations } from "next-intl";

export default function MainPage() {
  const t = useTranslations("MainPage");
  useDocumentTitle(`${t("tabTitle")}`);
  
  return (
    <>
      <MainBanner />
    </>
  );
}
