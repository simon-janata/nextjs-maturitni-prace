"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import Breadcrumbs from "@/components/Breadcrumbs";
import Fancybox from "@/components/Fancybox";
import SearchBar from "@/components/SearchBar";
import StudentCard from "@/components/StudentCard";
import {
  Anchor,
  Grid,
  Title, useMantineTheme
} from "@mantine/core";
import { useDocumentTitle } from "@mantine/hooks";

export default function YearPage({ params }: { params: { id: string } }) {
  useDocumentTitle("Year");
  const theme = useMantineTheme();
  const [classData, setClassData] = useState<Class>();
  const [students, setStudents] = useState<Student[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const breadcrumbsItems: JSX.Element[] = [
    { title: "Home", href: "/" },
    { title: "Classes", href: "/classes" },
    { title: "Details", href: `/classes/${params.id}` },
  ].map((item, index) => (
    <Anchor component={Link} href={item.href} key={index} c={theme.colors.pslib[6]}>
      {item.title}
    </Anchor>
  ));

  useEffect(() => {
    fetch(`/api/classes/${params.id}`, { method: "GET" })
      .then((res) => res.json())
      .then((data) => {
        setClassData(data);
        setStudents(data.students);
        setFilteredStudents(data.students);
        setLoading(false);
      });
  }, []);

  const handleSearch = (query: string) => {
    const filteredResults = students.filter((s) =>
      s.firstname.toLowerCase().includes(query) ||
      s.firstname.toUpperCase().includes(query) ||
      s.middlename.toLowerCase().includes(query) ||
      s.middlename.toUpperCase().includes(query) ||
      s.lastname.toLowerCase().includes(query) ||
      s.lastname.toUpperCase().includes(query)
    );

    setFilteredStudents(filteredResults);
  }

  return (
    <>
      <Breadcrumbs items={breadcrumbsItems} />

      {
        loading === true ? (
          <div>Loading...</div>
        ) : (
          <Title order={1}>{classData?.name}</Title>
        )
      }

      <SearchBar
        placeholder="Search by student name..."
        handleSearch={handleSearch}
      />

      {
        loading === true ? (
          <div>Loading...</div>
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
                  <Grid.Col span={{ xs: 12, sm: 6, md: 4 }}>
                    <StudentCard student={s} />
                  </Grid.Col>
                ))
              }
            </Grid>
          </Fancybox>
        )
      }
    </>
  );
}
