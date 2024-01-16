"use client";

import Link from "next/link";
import { useState } from "react";

import Breadcrumbs from "@/components/Breadcrumbs";
import {
  Anchor,
  useMantineTheme
} from "@mantine/core";
import { useDocumentTitle } from "@mantine/hooks";

export default function ClassesPage() {
  useDocumentTitle("Classes");
  const theme = useMantineTheme();
  const [loading, setLoading] = useState<boolean>(true);
  
  const breadcrumbsItems = [
    { title: "Home", href: "/" },
    { title: "Classes", href: "/classes" },
  ].map((item, index) => (
    <Anchor component={Link} href={item.href} key={index} c={theme.colors.pslib[6]}>
      {item.title}
    </Anchor>
  ));

  return (
    <>
      <Breadcrumbs items={breadcrumbsItems} />
      {/* <SimpleGrid cols={4}>
        <Card shadow="sm" padding="lg" radius="md" withBorder>
          
          <Card.Section>
            <Center>
              <IconFolderFilled style={{ width: 100, height: 100, color: "orange" }} stroke={1} />
            </Center>
          </Card.Section>

          <Text size="xl" fw={500} ta="center">P1</Text>
          <Text c="dimmed" ta="center">2020</Text>
        </Card>
      </SimpleGrid> */}
    </>
  );
}
