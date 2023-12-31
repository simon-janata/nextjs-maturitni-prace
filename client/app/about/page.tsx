"use client";

import Link from "next/link";
import { Flex, Title, Text, Button } from "@mantine/core";
import UnderConstruction from "@/assets/UnderConstruction.svg";

export default function AboutPage() {
  return (
    <>
      <Flex
        mih={50}
        gap="md"
        justify="center"
        align="center"
        direction="column"
        wrap="wrap"
      >
        <UnderConstruction />
        <Title >About page</Title>
        <Text c="dimmed" size="lg" ta="center" >
          There will be a section here that will display information about this web application and maybe some other information about the school and who knows what other information.
        </Text>
        <Button component={Link} href="/" size="md">Take me back to home page</Button>
      </Flex>
    </>
  );
}
