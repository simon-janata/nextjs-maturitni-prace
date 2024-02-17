"use client";

import Link from "next/link";

import {
  Box, Burger,
  Divider, Drawer, Group,
  Image, rem,
  ScrollArea
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useLocale, useTranslations } from "next-intl";

import ColorSchemeToggle from "../ColorSchemeToggle";
import LanguagePicker from "../LanguagePicker";
import NavbarSearch from "../NavbarSearch";
import classes from "./Navbar.module.css";

const Navbar = ({ refNavbar }: { refNavbar: React.RefObject<HTMLElement> }) => {
  const locale = useLocale();
  const p = useTranslations("Pathnames");
  const t = useTranslations("Navbar");
  const [drawerOpened, { toggle: toggleDrawer, close: closeDrawer }] = useDisclosure(false);

  return (
    <Box>
      <header ref={refNavbar} className={classes.header}>
        <Group justify="space-between" h="100%">
          <Link href={`/${locale}`} className={classes.linkLogo}>
            <Image src="/pslib-logo-dark.svg" className={classes.imgLogo} darkHidden />
            <Image src="/pslib-logo-light.svg" className={classes.imgLogo} lightHidden />
          </Link>

          <Group h="100%" gap={0} visibleFrom="sm">
            <Link href={`/${locale}`} className={classes.link}>
              {t("homePage")}
            </Link>
            <Link href={`/${locale}/${p("add")}`} className={classes.link}>
              {t("addPage")}
            </Link>
            <Link href={`/${locale}/${p("years")}`} className={classes.link}>
              {t("yearsPage")}
            </Link>
            <Link href={`/${locale}/${p("about")}`} className={classes.link}>
              {t("aboutPage")}
            </Link>
          </Group>

          <Group visibleFrom="sm" gap="sm">
            {/* <NavbarSearch /> */}
            <LanguagePicker />
            <ColorSchemeToggle />
          </Group>

          <Burger
            opened={drawerOpened}
            onClick={toggleDrawer}
            hiddenFrom="sm"
          />
        </Group>
      </header>

      <Drawer
        opened={drawerOpened}
        onClose={closeDrawer}
        size="100%"
        padding="md"
        title={t("drawerTitle")}
        hiddenFrom="sm"
        zIndex={1000}
      >
        <ScrollArea h={`calc(100vh - ${rem(80)})`} mx="-md">
          <Divider my="sm" />

          <Link href={`/${locale}`} className={classes.link} onClick={closeDrawer}>
            {t("homePage")}
          </Link>
          <Link href={`/${locale}/add`} className={classes.link} onClick={closeDrawer}>
            {t("addPage")}
          </Link>
          <Link href={`/${locale}/years`} className={classes.link} onClick={closeDrawer}>
            {t("yearsPage")}
          </Link>
          <Link href={`/${locale}/about`} className={classes.link} onClick={closeDrawer}>
            {t("aboutPage")}
          </Link>

          <Divider my="sm" />

          <Group justify="center" pb="xl" px="md">
            <LanguagePicker />
            <ColorSchemeToggle />
          </Group>
        </ScrollArea>
      </Drawer>
    </Box>
  );
}

export default Navbar;
