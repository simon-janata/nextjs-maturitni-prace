"use client";

import Link from "next/link";
import { Anchor } from "@mantine/core";
import { useDocumentTitle } from "@mantine/hooks";
import Welcome from "@/components/Welcome";
import Breadcrumbs from "@/components/Breadcrumbs";

export default function MainPage() {
  useDocumentTitle("Main");
  
  // const breadcrumbsItems = [
  //   { title: "Home", href: "/" },
  //   { title: "Classes", href: "/" },
  //   { title: "P4", href: "/" },
  // ].map((item, index) => (
  //   <Anchor component={Link} href={item.href} key={index}>
  //     {item.title}
  //   </Anchor>
  // ));

  return (
    <>
      {/* <Breadcrumbs items={breadcrumbsItems} /> */}
      <Welcome />
    </>
  );
}
