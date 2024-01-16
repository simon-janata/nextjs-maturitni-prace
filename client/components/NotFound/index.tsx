"use client";

import Link from "next/link";

import NotFoundSvg from "@/assets/404.svg";
import { Button, Container, Group, Text, Title } from "@mantine/core";

import classes from "./NotFound.module.css";

const NotFound = (props: { title: string, text: string, buttonAddress: string, buttonText: string }) => {
  return (
    <Container className={classes.root}>
      <div className={classes.inner}>
        <NotFoundSvg className={classes.image} />
        <div className={classes.content}>
          <Title className={classes.title}>
            {props.title}
          </Title>
          <Text c="dimmed" size="lg" ta="center" className={classes.description}>
            {props.text}
          </Text>
          <Group justify="center">
            <Button component={Link} href={props.buttonAddress} size="md">
              {props.buttonText}
            </Button>
          </Group>
        </div>
      </div>
    </Container>
  );
}

export default NotFound;
