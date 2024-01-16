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

export default function YearPage({ params }: { params: { id: string } }) {
  useDocumentTitle("Year");
  const theme = useMantineTheme();
  const [year, setYear] = useState<Year>();
  const [classes, setClasses] = useState<Class[]>([]);
  const [filteredClasses, setFilteredClasses] = useState<Class[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const breadcrumbsItems = [
    { title: "Home", href: "/" },
    { title: "Years", href: "/years" },
    { title: "Details", href: `/years/${params.id}` },
  ].map((item, index) => (
    <Anchor component={Link} href={item.href} key={index} c={theme.colors.pslib[6]}>
      {item.title}
    </Anchor>
  ));

  useEffect(() => {
    fetch(`/api/years/${params.id}`, { method: "GET" })
      .then((res) => res.json())
      .then((data) => {
        setYear(data);
        setClasses(data.classes);
        setFilteredClasses(data.classes);
        setLoading(false);
      });
  }, []);

  const handleSearch = (query: string) => {
    const filteredResults = classes.filter((c) =>
      c.name.toLowerCase().includes(query) || c.name.toUpperCase().includes(query)
    );

    setFilteredClasses(filteredResults);
  }

  return (
    <>
      <Breadcrumbs items={breadcrumbsItems} />
      <SearchBar
        placeholder="Search by class name..."
        handleSearch={handleSearch}
      />

      <h1>Year {params.id}</h1>
      <h2>{year?.year}</h2>

      <Flex
        gap="md"
        justify="flex-start"
        align="flex-start"
        direction="column"
        wrap="wrap"
      >
        {
          filteredClasses.map((c) => (
            <Anchor component={Link} href={`/classes/${c.id}`} key={c.id} c={theme.colors.pslib[6]}>{c.name}</Anchor>
          ))
        }
      </Flex>
    </>
  );
}
