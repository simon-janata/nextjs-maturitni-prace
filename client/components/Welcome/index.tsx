"use client";

import Link from "next/link";
import { Title, Text, Anchor } from "@mantine/core";
import classes from "./Welcome.module.css";

const Welcome = () => {
  return (
    <>
      <Title className={classes.title} ta="center" mt={100}>
        Welcome to{" "}
        <Text
          inherit
          component="span"
          c="#4154fa"
        >
          Mantine
        </Text>
      </Title>
      <Text c="dimmed" ta="center" size="lg" maw={580} mx="auto" mt="xl">
        This starter Next.js project includes a minimal setup for server side
        rendering, if you want to learn more on Mantine + Next.js integration
        follow{" "}
        <Anchor component={Link} href="https://mantine.dev/guides/next/" size="lg">
          this guide
        </Anchor>
        . To get started edit page.tsx file.
      </Text>
    </>
  );
}

export default Welcome;
