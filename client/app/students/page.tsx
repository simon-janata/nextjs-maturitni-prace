"use client";

import Link from "next/link";
import { useState } from "react";

import Breadcrumbs from "@/components/Breadcrumbs";
import SearchBar from "@/components/SearchBar";
import {
  Anchor,
  useMantineTheme
} from "@mantine/core";
import { useDocumentTitle } from "@mantine/hooks";

export default function StudentsPage() {
  useDocumentTitle("Students");
  const theme = useMantineTheme();
  const [students, setStudents] = useState<Student[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  
  const breadcrumbsItems = [
    { title: "Home", href: "/" },
    { title: "Students", href: "/students" },
  ].map((item, index) => (
    <Anchor component={Link} href={item.href} key={index} c={theme.colors.pslib[6]}>
      {item.title}
    </Anchor>
  ));

  const handleSearch = (query: string) => {
    const filteredResults = students.filter((s) =>
      s.firstname.includes(query) || s.middlename.includes(query) || s.lastname.includes(query)
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
