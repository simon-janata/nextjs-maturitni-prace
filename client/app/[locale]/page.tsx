"use client";

import { useTranslations } from 'next-intl';

import MainBanner from '@/components/MainBanner';
import { useDocumentTitle } from '@mantine/hooks';

export default function MainPage() {
  const t = useTranslations("MainPage");
  useDocumentTitle(`${t("tabTitle")}`);

  return (
    <>
      <MainBanner />
    </>
  );
}
