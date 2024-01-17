"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import Breadcrumbs from "@/components/Breadcrumbs";
import DirectoryCard from "@/components/DirectoryCard";
import SearchBar from "@/components/SearchBar";
import {
  Anchor,
  Center,
  Grid,
  Loader,
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
    { title: "2021", href: `/years/${params.id}` },
  ].map((item, index) => (
    <Anchor component={Link} href={item.href} key={index} c={theme.colors.pslib[6]}>
      {item.title}
    </Anchor>
  ));

  useEffect(() => {
    let dataLoaded = false;

    setTimeout(() => {
      if (dataLoaded) {
        setLoading(false);
      }
    }, 1500);

    fetch(`/api/years/${params.id}`, { method: "GET" })
      .then((res) => res.json())
      .then((data) => {
        setYear(data);
        setClasses(data.classes);
        setFilteredClasses(data.classes);
        dataLoaded = true;
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

      {
        loading === true ? (
          <Center>
            <Loader color={theme.colors.pslib[6]} type="bars" />
          </Center>
        ) : (
          <Grid>
            {
              filteredClasses.map((c) => (
                <Grid.Col span={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
                  <DirectoryCard entity={c} type="class" />
                </Grid.Col>
              ))
            }
          </Grid>
        )
      }
    </>
  );
}
