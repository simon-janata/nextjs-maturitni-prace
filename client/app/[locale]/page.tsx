"use client";

import MainBanner from "@/components/MainBanner";
import { useDocumentTitle } from "@mantine/hooks";

export default function MainPage() {
  useDocumentTitle("Main");
  
  return (
    <>
      <MainBanner />
    </>
  );
}
