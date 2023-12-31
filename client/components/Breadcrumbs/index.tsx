"use client";

import { Breadcrumbs as BC } from "@mantine/core";

const Breadcrumbs = ({ items }: { items: JSX.Element[] }) => {
  return (
    <BC aria-disabled>{items}</BC>
  );
}

export default Breadcrumbs;
