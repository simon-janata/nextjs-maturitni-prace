"use client";

import cx from "clsx";
import { ActionIcon, useMantineTheme, useMantineColorScheme, useComputedColorScheme, Group } from "@mantine/core";
import { IconSun, IconMoon } from "@tabler/icons-react";
import classes from "./ColorSchemeToggle.module.css";

const ColorSchemeToggle = () => {
  const theme = useMantineTheme();
  const { setColorScheme } = useMantineColorScheme();
  const computedColorScheme = useComputedColorScheme("light", { getInitialValueInEffect: true });

  return (
    <Group justify="center">
      <ActionIcon
        onClick={() => setColorScheme(computedColorScheme === "light" ? "dark" : "light")}
        variant="default"
        size="xl"
        radius="md"
        aria-label="Toggle color scheme"
      >
        <IconSun className={cx(classes.icon, classes.light)} stroke={1.5} color={theme.colors.yellow[4]} />
        <IconMoon className={cx(classes.icon, classes.dark)} stroke={1.5} color={theme.colors.blue[6]} />
      </ActionIcon>
    </Group>
  );
}

export default ColorSchemeToggle;
