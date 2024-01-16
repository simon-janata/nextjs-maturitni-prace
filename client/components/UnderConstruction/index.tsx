"use client";

import Link from "next/link";

import underConstruction from "@/assets/under-construction.png";
import { Button, Flex, Image, Text, Title } from "@mantine/core";

const UnderConstruction = (props: { pageName: string, description: string }) => {
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
        <Image
          radius="md"
          h="auto"
          w="50%"
          mb={30}
          fit="contain"
          src={underConstruction.src}
          fallbackSrc="https://placehold.co/1920x1080?text=Not+found"
        />
        <Title>
          {props.pageName}
        </Title>
        <Text c="dimmed" size="lg" ta="center" >
          {props.description}
        </Text>
        <Button component={Link} href="/" size="md">Take me back to home page</Button>
      </Flex>
    </>
  );
}

export default UnderConstruction;
