"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";

import Breadcrumbs from "@/components/Breadcrumbs";
import DirectoryCard from "@/components/DirectoryCard";
import SearchBar from "@/components/SearchBar";
import {
  Anchor,
  Center,
  Grid,
  Loader,
  Title,
  useMantineTheme
} from "@mantine/core";
import { useDocumentTitle } from "@mantine/hooks";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";

export default function ClassesPage({ params }: { params: { year: number } }) {
  useDocumentTitle(`School year ${params.year}`);
  const locale = useLocale();
  const t = useTranslations("ClassesPage");
  const theme = useMantineTheme();
  const [year, setYear] = useState<Year>();
  const [classes, setClasses] = useState<Class[]>([]);
  const [filteredClasses, setFilteredClasses] = useState<Class[]>([]);
  const [query, setQuery] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);

  const breadcrumbsItems = [
    { title: t("breadcrumbs.home"), href: `/${locale}` },
    { title: t("breadcrumbs.schoolYears"), href: `/${locale}/years` },
    { title: `${params.year}`, href: `/${locale}/years/${params.year}` },
  ].map((item, index) => (
    <Anchor component={Link} href={item.href} key={uuidv4()} c={theme.colors.pslib[6]}>
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

    // fetch(`${process.env.NEXT_PUBLIC_API_URL}/${locale}/api/years/${params.year}`, { method: "GET" })
    //   .then((res) => res.json())
    //   .then((data) => {
    //     setYear(data);
    //     setClasses(data.classes);
    //     setFilteredClasses(data.classes);
    //     dataLoaded = true;
    // });
    axios.get(`${process.env.NEXT_PUBLIC_API_URL}/${locale}/api/years/${params.year}`)
      .then((res) => {
        const data = res.data;
        setYear(data);
        setClasses(data.classes);
        setFilteredClasses(data.classes);
        dataLoaded = true;
      });
  }, []);

  const handleSearch = (searchQuery: string) => {
    setQuery(searchQuery);
    const filteredResults = classes.filter((c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    setFilteredClasses(filteredResults);
  }

  return (
    <>
      <Breadcrumbs items={breadcrumbsItems} />
      <SearchBar
        placeholder={t("searchBar.placeholder")}
        handleSearch={handleSearch}
      />

      {
        loading === true ? (
          <Center>
            <Loader color={theme.colors.pslib[6]} type="bars" />
          </Center>
        ) : (
          filteredClasses.length === 0 ? (
            <Center>
              <Title order={1}>No classes found</Title>
            </Center>
          ) : (
            <Grid>
              {
                filteredClasses.map((c) => (
                  <Grid.Col span={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={uuidv4()}>
                    <DirectoryCard entity={c} type="class" classParameter={params.year} textToHighlight={query} />
                  </Grid.Col>
                ))
              }
            </Grid>
          )
        )
      }
    </>
  );
}
