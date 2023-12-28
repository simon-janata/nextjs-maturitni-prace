"use client";

// import Image from "next/image";
import Link from "next/link";
import Welcome from "@/components/Welcome";
import Breadcrumbs from "@/components/Breadcrumbs";
import { Anchor } from "@mantine/core";

export default function Home() {
  const breadcrumbsItems = [
    { title: "Home", href: "/" },
    { title: "Classes", href: "/" },
    { title: "P4", href: "/" },
  ].map((item, index) => (
    <Anchor component={Link} href={item.href} key={index}>
      {item.title}
    </Anchor>
  ));

  return (
    <main>
      {/* <Breadcrumbs items={breadcrumbsItems} /> */}
      <Welcome />
    </main>
  )
}
