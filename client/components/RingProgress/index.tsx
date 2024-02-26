"use client";

import { useState } from "react";
import { RingProgress as RingProgressMantine, Flex, Text, Center, Button, useMantineTheme, ActionIcon, rem } from "@mantine/core";
import { IconCheck } from "@tabler/icons-react";

import classes from "./RingProgress.module.css";

interface RingProgressProps {
  value: number;
  label: string;
}

const RingProgress: React.FC<RingProgressProps> = ({ value, label }) => {
  const theme = useMantineTheme();

  return (
    <>
      <Flex
        direction="column"
        align="center"
        justify="center"
      >
        {
          value === 100 ? (
            <>
              <RingProgressMantine
                size={180}
                roundCaps
                classNames={classes}
                sections={[{ value: 100, color: "teal" }]}
                label={
                  <Center>
                    <ActionIcon color="teal" variant="light" radius="50%" size={84}>
                      <IconCheck style={{ width: rem(44), height: rem(44) }} />
                    </ActionIcon>
                  </Center>
                }
              />
              <Text c="gray" fw={500}>{label}</Text>
            </>
          ) : (
            <>
              <RingProgressMantine
                size={180}
                roundCaps
                classNames={classes}
                sections={[{ value: value, color: theme.colors.pslib[6] }]}
                label={
                  <Text c={theme.colors.pslib[6]} fw={700} ta="center" size="24">
                    {Math.round(value)}%
                  </Text>
                }
              />
              <Text c="gray" fw={500} className={classes.loading}>{label}</Text>
            </>
          )
        }
      </Flex>
    </>
  );
}

export default RingProgress;
