"use client";

import Link from "next/link";

import { Button, Container, Text, Title } from "@mantine/core";
import { useTranslations, useLocale } from "next-intl";

import Dots from "./Dots";
import classes from "./MainBanner.module.css";

const MainBanner = () => {
  const locale = useLocale();
  const t = useTranslations("MainBanner");

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
          {t("title.firstPart")}{" "}
          <Text component="span" className={classes.highlight} inherit>
            {t("title.secondPart")}
          </Text>{" "}
          {t("title.thirdPart")}
        </Title>

        <Container p={0} size={600}>
          <Text size="lg" c="dimmed" fw={500} className={classes.description}>
            {t("description")}
          </Text>
        </Container>

        <div className={classes.controls}>
          <Button component={Link} href={`/${locale}/about`} className={classes.control} size="lg" variant="default" color="gray">
            {t("leftButton")}
          </Button>
          <Button component={Link} href={`/${locale}/add`} className={classes.control} size="lg">
            {t("rightButton")}
          </Button>
        </div>
      </div>
    </Container>
  );
}

export default MainBanner;
