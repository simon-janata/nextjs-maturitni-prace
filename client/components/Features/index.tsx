"use client";

import { Text, SimpleGrid, Container, rem } from "@mantine/core";
import { IconTruck, IconCertificate, IconCoin, IconCameraCog, IconCrop, IconHeartHandshake } from "@tabler/icons-react";
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
        <Icon style={{ width: rem(38), height: rem(38) }} className={classes.icon} stroke={1.5} />
        <Text fw={700} fz="lg" mb="xs" mt={5} className={classes.title}>
          {title}
        </Text>
        <Text c="dimmed" fz="sm">
          {description}
        </Text>
      </div>
    </div>
  );
}

const mockdata = [
  {
    icon: IconCameraCog,
    title: "Automated Photo Processing",
    description:
      "Automatically crops and names photographs of new students, saving teachers from having to do this manually.",
  },
  {
    icon: IconCrop,
    title: "Standardized Profile Pictures",
    description:
      "Applies a standard set of edits to each photo, ensuring that all profile pictures have a consistent appearance.",
  },
  {
    icon: IconHeartHandshake,
    title: "User-Friendly Interface",
    description:
      "Provides a simple, intuitive interface that makes it easy for teachers to upload photos, view the processed results, and make any necessary adjustments.",
  },
];

const Features = () => {
  const items = mockdata.map((item) => <Feature {...item} key={item.title} />);

  return (
    <Container mb={30} size="lg">
      <SimpleGrid cols={{ base: 1, sm: 3 }} spacing={50}>
        {items}
      </SimpleGrid>
    </Container>
  );
}

export default Features;
