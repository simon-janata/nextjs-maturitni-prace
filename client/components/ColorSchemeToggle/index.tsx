"use client";

import cx from "clsx";

import {
  ActionIcon, Group, useComputedColorScheme, useMantineColorScheme, useMantineTheme
} from "@mantine/core";
import { IconMoon, IconSun } from "@tabler/icons-react";

import classes from "./ColorSchemeToggle.module.css";

const ColorSchemeToggle = () => {
  const theme = useMantineTheme();
  const { setColorScheme } = useMantineColorScheme();
  const computedColorScheme = useComputedColorScheme("light", { getInitialValueInEffect: true });

  return (
    <Group justify="center">
      <ActionIcon
        className={classes.button}
        onClick={() => setColorScheme(computedColorScheme === "light" ? "dark" : "light")}
        variant="default"
        size="xl"
        radius="md"
        aria-label="Toggle color scheme"
      >
        <IconSun className={cx(classes.icon, classes.light)} stroke={1.5} color={theme.colors.yellow[4]} />
        <IconMoon className={cx(classes.icon, classes.dark)} stroke={1.5} color={theme.colors.pslib[6]} />
      </ActionIcon>
    </Group>
  );
}

export default ColorSchemeToggle;
