"use client";

import { useTranslations } from "next-intl";

import { Container, rem, SimpleGrid, Text } from "@mantine/core";
import {
  IconCameraCog,
  IconCrop,
  IconHeartHandshake,
} from "@tabler/icons-react";

import classes from "./Features.module.css";

interface FeatureProps extends React.ComponentPropsWithoutRef<"div"> {
  icon: React.FC<any>;
  title: string;
  description: string;
}

const Feature = ({ icon: Icon, title, description, className, ...others }: FeatureProps) => {
  return (
    <div className={classes.feature} {...others}>
      <div className={classes.overlay} />

      <div className={classes.content}>
        <Icon
          style={{ width: rem(38), height: rem(38) }}
          className={classes.icon}
          stroke={1.5}
        />
        <Text fw={700} fz="lg" mb="xs" mt={5} className={classes.title}>
          {title}
        </Text>
        <Text c="dimmed" fz="sm">
          {description}
        </Text>
      </div>
    </div>
  );
};

const Features = () => {
  const t = useTranslations("Features");

  const mockdata = [
    {
      icon: IconCameraCog,
      title: t("first.title"),
      description: t("first.description"),
    },
    {
      icon: IconCrop,
      title: t("second.title"),
      description: t("second.description"),
    },
    {
      icon: IconHeartHandshake,
      title: t("third.title"),
      description: t("third.description"),
    },
  ];

  const items = mockdata.map((item) => <Feature {...item} key={item.title} />);

  return (
    <Container mb={30} size="lg">
      <SimpleGrid cols={{ base: 1, sm: 3 }} spacing={50}>
        {items}
      </SimpleGrid>
    </Container>
  );
};

export default Features;
