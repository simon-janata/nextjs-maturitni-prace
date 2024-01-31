"use client";

import { Breadcrumbs as BreadcrumbsMantine, rem } from "@mantine/core";
import { IconSlash } from "@tabler/icons-react";

import classes from "./Breadcrumbs.module.css";

const Breadcrumbs = ({ items }: { items: JSX.Element[] }) => {
  return (
    <BreadcrumbsMantine
      classNames={classes}
      separator={<IconSlash style={{ width: rem(20), height: rem(20) }} />}
    >
      {items}
    </BreadcrumbsMantine>
  );
}

export default Breadcrumbs;
