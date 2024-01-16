"use client";


import MainBanner from "@/components/MainBanner";
import { useDocumentTitle } from "@mantine/hooks";

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
      <MainBanner />
    </>
  );
}
