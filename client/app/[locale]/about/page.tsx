"use client";

import { useTranslations } from "next-intl";
import Link from "next/link";

import Features from "@/components/Features";
import { Button, Center, rem } from "@mantine/core";
import { useDocumentTitle } from "@mantine/hooks";
import { GithubIcon } from "@mantinex/dev-icons";

export default function AboutPage() {
  const t = useTranslations("AboutPage");
  useDocumentTitle(`${t("tabTitle")}`);

  return (
    <>
      <Features />

      <Center>
        <Button
          component={Link}
          href="https://github.com/pslib-cz/MP2023-24_Janata-Simon_Webova-aplikace-pro-zpracovani-a-naslednou-upravu-fotografii-novych-studentu"
          target="_blank"
          size="md"
          mt="xl"
          leftSection={
            <GithubIcon style={{ width: rem(20), height: rem(20) }} />
          }
          style={{
            backgroundColor: "var(--mantine-color-dark-9)",
            color: "#fff",
          }}
        >
          {t("githubButton")}
        </Button>
      </Center>
    </>
  );
}
