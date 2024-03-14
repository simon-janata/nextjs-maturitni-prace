"use client";

import axios from "axios";
import { useLocale, useTranslations } from "next-intl";
import Link from "next/link";
import { useEffect, useState } from "react";
import { v4 as uuid } from "uuid";

import Breadcrumbs from "@/components/Breadcrumbs";
import DirectoryCard from "@/components/DirectoryCard";
import SearchBar from "@/components/SearchBar";
import {
  Anchor,
  Center,
  Grid,
  Loader,
  Title,
  useMantineTheme,
} from "@mantine/core";
import { useDocumentTitle } from "@mantine/hooks";

export default function SchoolYearsPage() {
  const t = useTranslations("SchoolYearsPage");
  useDocumentTitle(`${t("tabTitle")}`);
  const locale = useLocale();
  const p = useTranslations("Pathnames");
  const theme = useMantineTheme();
  const [schoolYears, setSchoolYears] = useState<Array<SchoolYear>>([]);
  const [filteredSchoolYears, setFilteredSchoolYears] = useState<Array<SchoolYear>>([]);
  const [query, setQuery] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);

  const breadcrumbsItems = [
    { title: t("breadcrumbs.home"), href: `/${locale}` },
    {
      title: t("breadcrumbs.schoolYears"),
      href: `/${locale}/${p("schoolYears")}`,
    },
  ].map((item) => (
    <Anchor
      component={Link}
      href={item.href}
      key={uuid()}
      c={theme.colors.pslib[6]}
    >
      {item.title}
    </Anchor>
  ));

  useEffect(() => {
    const dataPromise = axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/cs/api/schoolYears`)
      .then((res) => {
        const data = res.data;
        setSchoolYears(data);
        setFilteredSchoolYears(data);
      })
      .catch((err) => {
        console.error(err);
      });

    const timeoutPromise = new Promise((resolve) => setTimeout(resolve, 1000));

    Promise.all([dataPromise, timeoutPromise]).then(() => setLoading(false));
  }, []);

  const handleSearch = (searchQuery: string) => {
    setQuery(searchQuery);
    const filteredResults = schoolYears.filter((y) =>
      y.year.toString().includes(searchQuery)
    );

    setFilteredSchoolYears(filteredResults);
  };

  return (
    <>
      <Breadcrumbs items={breadcrumbsItems} />
      <SearchBar
        placeholder={t("searchBar.placeholder")}
        handleSearch={handleSearch}
      />

      {loading === true ? (
        <Center>
          <Loader color={theme.colors.pslib[6]} />
        </Center>
      ) : filteredSchoolYears.length === 0 ? (
        <Center>
          <Title order={1}>{t("title")}</Title>
        </Center>
      ) : (
        <Grid>
          {filteredSchoolYears.map((y) => (
            <Grid.Col span={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={uuid()}>
              <DirectoryCard
                entity={y}
                model="schoolYear"
                textToHighlight={query}
              />
            </Grid.Col>
          ))}
        </Grid>
      )}
    </>
  );
}
