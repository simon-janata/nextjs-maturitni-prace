"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";

import Breadcrumbs from "@/components/Breadcrumbs";
import Fancybox from "@/components/Fancybox";
import SearchBar from "@/components/SearchBar";
import StudentCard from "@/components/StudentCard";
import { IconFileZip } from "@tabler/icons-react";
import {
  IconSettings,
  IconSearch,
  IconPhoto,
  IconMessageCircle,
  IconTrash,
  IconArrowsLeftRight,
  IconDotsVertical,
} from '@tabler/icons-react';
import {
  Anchor,
  Center,
  Grid,
  Loader,
  Title,
  Button,
  Menu,
  rem,
  Flex,
  Text,
  UnstyledButton,
  useMantineTheme
} from "@mantine/core";
import { useDocumentTitle } from "@mantine/hooks";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";

export default function StudentsPage({ params }: { params: { year: number, class: string } }) {
  useDocumentTitle("Year");
  const locale = useLocale();
  const t = useTranslations("StudentsPage");
  const theme = useMantineTheme();
  const [classData, setClassData] = useState<Class>();
  const [students, setStudents] = useState<Student[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
  const [query, setQuery] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);

  const breadcrumbsItems: JSX.Element[] = [
    { title: t("breadcrumbs.home"), href: `/${locale}` },
    { title: t("breadcrumbs.schoolYears"), href: `/${locale}/years` },
    { title: `${params.year}`, href: `/${locale}/years/${params.year}` },
    { title: `${params.class.toUpperCase()}`, href: `/${locale}/years/${params.year}/classes/${params.class}` },
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

    // fetch(`${process.env.NEXT_PUBLIC_API_URL}/${locale}/api/years/${params.year}/classes/${params.class}`, { method: "GET" })
    //   .then((res) => res.json())
    //   .then((data) => {
    //     setClassData(data);
    //     setStudents(data.students);
    //     setFilteredStudents(data.students);
    //     dataLoaded = true;
    // });
    axios.get(`${process.env.NEXT_PUBLIC_API_URL}/${locale}/api/years/${params.year}/classes/${params.class}`)
      .then((res) => {
        const data = res.data;
        setClassData(data);
        setStudents(data.students);
        setFilteredStudents(data.students);
        dataLoaded = true;
      });
  }, []);

  const handleSearch = (searchQuery: string) => {
    setQuery(searchQuery);
    const filteredResults = students.filter((s) =>
      s.firstname.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.middlename.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.lastname.toLowerCase().includes(searchQuery.toLowerCase())
    );

    setFilteredStudents(filteredResults);
  }

  const handleDeleteClass = () => {
    // fetch(`${process.env.NEXT_PUBLIC_API_URL}/${locale}/api/years/${params.year}/classes/${params.class}`, { method: "DELETE" })
    //   .then((res) => res.json())
    //   .then((data) => {
    //     console.log(data);
    //   })
    //   .catch((err) => {
    //     console.log(`Error deleting book - ${err}`);
    //   });
    axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/${locale}/api/years/${params.year}/classes/${params.class}`)
      .then((res) => {
        console.log(res.data);
      })
      .catch((err) => {
        console.log(`Error deleting book - ${err}`);
      });
  };

  return (
    <>
      <Flex
        direction="row"
        justify="space-between"
        align="center"
      >
        <Breadcrumbs items={breadcrumbsItems} />
        <Menu shadow="md" width={250} position="bottom-end" withArrow>
          <Menu.Target>
            <UnstyledButton w={24} h={24}>
              <IconSettings />
            </UnstyledButton>
          </Menu.Target>

          <Menu.Dropdown>
            <Menu.Item leftSection={<IconFileZip style={{ width: rem(14), height: rem(14) }} />}>
              Download all photos (.zip)
            </Menu.Item>
            <Menu.Item
              color="red"
              leftSection={<IconTrash style={{ width: rem(14), height: rem(14) }} />}
              onClick={handleDeleteClass}
            >
              Delete this class
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </Flex>

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
          filteredStudents.length === 0 ? (
            <Center>
              <Title order={1}>No students found</Title>
            </Center>
          ) : (
            <Fancybox
              options={{
                Carousel: {
                  infinite: false,
                },
              }}
            >
              <Grid>
                {
                  filteredStudents.map((s) => (
                    <Grid.Col span={{ xs: 12, sm: 6, md: 4 }} key={uuidv4()}>
                      <StudentCard student={s} textToHighlight={query} />
                    </Grid.Col>
                  ))
                }
              </Grid>
            </Fancybox>
          )
        )
      }
    </>
  );
}
