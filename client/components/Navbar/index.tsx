"use client";

import Link from "next/link";

import {
  Box, Burger,
  Divider, Drawer, Group,
  Image, rem,
  ScrollArea
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";

import ColorSchemeToggle from "../ColorSchemeToggle";
import LanguagePicker from "../LanguagePicker";
import NavbarSearch from "../NavbarSearch";
import classes from "./Navbar.module.css";

const Navbar = ({ refNavbar }: { refNavbar: React.RefObject<HTMLElement> }) => {
  const [drawerOpened, { toggle: toggleDrawer, close: closeDrawer }] = useDisclosure(false);

  return (
    <Box>
      <header ref={refNavbar} className={classes.header}>
        <Group justify="space-between" h="100%">
          <Link href="/" className={classes.linkLogo}>
            <Image src="/pslib-logo-dark.svg" className={classes.imgLogo} darkHidden />
            <Image src="/pslib-logo-light.svg" className={classes.imgLogo} lightHidden />
          </Link>

          <Group h="100%" gap={0} visibleFrom="sm">
            <Link href="/" className={classes.link}>
              Home
            </Link>
            <Link href="/add" className={classes.link}>
              Add
            </Link>
            <Link href="/years" className={classes.link}>
              School years
            </Link>
            <Link href="/about" className={classes.link}>
              About
            </Link>
          </Group>

          <Group visibleFrom="sm" gap="sm">
            <NavbarSearch />
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
        title="Navigation"
        hiddenFrom="sm"
        zIndex={10000}
      >
        <ScrollArea h={`calc(100vh - ${rem(80)})`} mx="-md">
          <Divider my="sm" />

          <Link href="/" className={classes.link} onClick={closeDrawer}>
            Home
          </Link>
          <Link href="/add" className={classes.link} onClick={closeDrawer}>
            Add
          </Link>
          <Link href="/years" className={classes.link} onClick={closeDrawer}>
            School years
          </Link>
          <Link href="/about" className={classes.link} onClick={closeDrawer}>
            About
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
