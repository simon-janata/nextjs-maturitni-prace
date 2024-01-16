"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import Breadcrumbs from "@/components/Breadcrumbs";
import SearchBar from "@/components/SearchBar";
import {
  Anchor,
  Flex,
  useMantineTheme
} from "@mantine/core";
import { useDocumentTitle } from "@mantine/hooks";

export default function YearsPage() {
  useDocumentTitle("Years");
  const theme = useMantineTheme();
  const [years, setYears] = useState<Year[]>([]);
  const [filteredYears, setFilteredYears] = useState<Year[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  
  const breadcrumbsItems = [
    { title: "Home", href: "/" },
    { title: "Years", href: "/years" },
  ].map((item, index) => (
    <Anchor component={Link} href={item.href} key={index} c={theme.colors.pslib[6]}>
      {item.title}
    </Anchor>
  ));

  useEffect(() => {
    fetch("/api/years", { method: "GET" })
      .then((res) => res.json())
      .then((data) => {
        setYears(data);
        setFilteredYears(data);
        setLoading(false);
      });
  }, []);

  const handleSearch = (query: string) => {
    const filteredResults = years.filter((y) =>
      y.year.toString().includes(query)
    );

    setFilteredYears(filteredResults);
  }

  return (
    <>
      <Breadcrumbs items={breadcrumbsItems} />
      <SearchBar
        placeholder="Search by year..."
        handleSearch={handleSearch}
      />

      {/* <SimpleGrid cols={4}>
        {
          filteredYears.map((y) => (
            <Card component={Link} href={`/years/${y.id}`} padding="lg" radius="md" withBorder key={y.year}>
              <Card.Section>
                <Center>
                  <IconFolderFilled style={{ width: 100, height: 100, color: "orange" }} stroke={1} />
                </Center>
              </Card.Section>

              <Text size="xl" fw={500} ta="center">{y.year}</Text>
            </Card>
          ))
        }
      </SimpleGrid> */}
      <Flex
        gap="md"
        justify="flex-start"
        align="flex-start"
        direction="column"
        wrap="wrap"
      >
        {
          filteredYears.map((y) => (
            <Anchor component={Link} href={`/years/${y.id}`} key={y.id} c={theme.colors.pslib[6]}>{y.year}</Anchor>
          ))
        }
      </Flex>
    </>
  );
}
