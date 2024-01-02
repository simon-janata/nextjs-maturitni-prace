"use client";

import { Breadcrumbs as BreadcrumbsMantine } from "@mantine/core";

const Breadcrumbs = ({ items }: { items: JSX.Element[] }) => {
  return (
    <BreadcrumbsMantine aria-disabled>{items}</BreadcrumbsMantine>
  );
}

export default Breadcrumbs;
