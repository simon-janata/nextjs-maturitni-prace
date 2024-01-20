"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import Breadcrumbs from "@/components/Breadcrumbs";
import Fancybox from "@/components/Fancybox";
import SearchBar from "@/components/SearchBar";
import StudentCard from "@/components/StudentCard";
import {
  Anchor,
  Center,
  Grid,
  Loader,
  Title,
  useMantineTheme
} from "@mantine/core";
import { useDocumentTitle } from "@mantine/hooks";

export default function StudentsPage({ params }: { params: { year: number, class: string } }) {
  useDocumentTitle("Year");
  const theme = useMantineTheme();
  const [classData, setClassData] = useState<Class>();
  const [students, setStudents] = useState<Student[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
  const [query, setQuery] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);

  const breadcrumbsItems: JSX.Element[] = [
    { title: "Home", href: "/" },
    { title: "School years", href: "/years" },
    { title: `${params.year}`, href: `/years/${params.year}` },
    { title: `${params.class.toUpperCase()}`, href: `/years/${params.year}/classes/${params.class}` },
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

    fetch(`/api/years/${params.year}/classes/${params.class.toUpperCase()}`, { method: "GET" })
      .then((res) => res.json())
      .then((data) => {
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

  return (
    <>
      <Breadcrumbs items={breadcrumbsItems} />

      <SearchBar
        placeholder="Search by student name..."
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
                  Array.isArray(filteredStudents) && filteredStudents.map((s) => (
                    <Grid.Col span={{ xs: 12, sm: 6, md: 4 }}>
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
