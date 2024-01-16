"use client";

import Link from "next/link";

import { Button, Container, Text, Title } from "@mantine/core";

import Dots from "./Dots";
import classes from "./MainBanner.module.css";

const MainBanner = () => {
  return (
    <Container className={classes.wrapper} size={1400}>
      <Dots className={classes.dots} style={{ left: 0, top: 0 }} />
      <Dots className={classes.dots} style={{ left: 100, top: 0 }} />
      <Dots className={classes.dots} style={{ left: 200, top: 0 }} />
      <Dots className={classes.dots} style={{ left: 0, top: 100 }} />
      <Dots className={classes.dots} style={{ left: 100, top: 100 }} />
      <Dots className={classes.dots} style={{ left: 0, top: 200 }} />
      <Dots className={classes.dots} style={{ left: 0, top: 300 }} />
      <Dots className={classes.dots} style={{ right: 0, top: 0 }} />
      <Dots className={classes.dots} style={{ right: 100, top: 0 }} />
      <Dots className={classes.dots} style={{ right: 200, top: 0 }} />
      <Dots className={classes.dots} style={{ right: 0, top: 100 }} />
      <Dots className={classes.dots} style={{ right: 100, top: 100 }} />
      <Dots className={classes.dots} style={{ right: 0, top: 200 }} />

      <div className={classes.inner}>
        <Title className={classes.title}>
          Streamline Your{" "}
          <Text component="span" className={classes.highlight} inherit>
            Student Photo Management
          </Text>{" "}
          with Automation
        </Title>

        <Container p={0} size={600}>
          <Text size="lg" c="dimmed" fw={500} className={classes.description}>
            Simplify the process of cropping, naming, and editing new student photos with our web-based application. Designed to increase efficiency, unify the look of profile photos, and ease administrative procedures.
          </Text>
        </Container>

        <div className={classes.controls}>
          <Button component={Link} href="/about" className={classes.control} size="lg" variant="default" color="gray">
            Learn More
          </Button>
          <Button component={Link} href="/add" className={classes.control} size="lg">
            Get Started
          </Button>
        </div>
      </div>
    </Container>
  );
}

export default MainBanner;
