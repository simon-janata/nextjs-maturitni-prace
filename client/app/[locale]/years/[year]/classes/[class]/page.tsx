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
  IconCheck,
  IconShare,
} from '@tabler/icons-react';
import {
  Anchor,
  Center,
  Grid,
  Loader,
  Title,
  Group,
  Button,
  Modal,
  Menu,
  rem,
  Flex,
  Text,
  UnstyledButton,
  useMantineTheme
} from "@mantine/core";
import { useDocumentTitle, useDisclosure } from "@mantine/hooks";
import axios from "axios";
import { v4 as uuid } from "uuid";
import { useRouter } from "next/navigation";
import { notifications } from "@mantine/notifications";

export default function StudentsPage({ params }: { params: { year: number, class: string } }) {
  useDocumentTitle("Year");
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations("StudentsPage");
  const p = useTranslations("Pathnames");
  const theme = useMantineTheme();
  const [classData, setClassData] = useState<Class>();
  const [students, setStudents] = useState<Student[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
  const [query, setQuery] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);

  const [opened, { open, close }] = useDisclosure(false);

  const breadcrumbsItems: JSX.Element[] = [
    { title: t("breadcrumbs.home"), href: `/${locale}` },
    { title: t("breadcrumbs.schoolYears"), href: `/${locale}/${p("years")}` },
    { title: `${params.year}`, href: `/${locale}/${p("years")}/${params.year}` },
    { title: `${params.class.toUpperCase()}`, href: `/${locale}/${p("years")}/${params.year}/${p("classes")}/${params.class}` },
  ].map((item, index) => (
    <Anchor component={Link} href={item.href} key={uuid()} c={theme.colors.pslib[6]}>
      {item.title}
    </Anchor>
  ));
  
  useEffect(() => {
    let dataLoaded = false;

    setTimeout(() => {
      if (dataLoaded) {
        setLoading(false);
      }
    }, 1000);

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
    axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/${locale}/api/years/${params.year}/classes/${params.class}`)
      .then((res) => {
        router.push(`/${locale}/years/${params.year}`);
        notifications.show({
          color: "teal",
          icon: <IconCheck style={{ width: rem(18), height: rem(18) }} />,
          title: "Default notification",
          message: "Hey there, your code is awesome! 🤥",
          autoClose: 2000,
        });
      })
      .catch((err) => {
        console.log(`Error deleting class - ${err}`);
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
            <Menu.Item leftSection={<IconShare style={{ width: rem(14), height: rem(14) }} />}>
              Share this class
            </Menu.Item>
            <Menu.Item
              color="red"
              leftSection={<IconTrash style={{ width: rem(14), height: rem(14) }} />}
              onClick={open}
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
            <Loader color={theme.colors.pslib[6]} />
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
                    <Grid.Col span={{ xs: 12, sm: 6, md: 4 }} key={uuid()}>
                      <StudentCard student={s} textToHighlight={query} />
                    </Grid.Col>
                  ))
                }
              </Grid>
            </Fancybox>
          )
        )
      }

      <Modal opened={opened} onClose={close} title="Delete Class Confirmation" centered radius="md" zIndex={1000}>
        Are you sure you want to delete this class? Deleting this class will also delete all associated students and their photos. This action cannot be undone. Please confirm your decision.
        <Group justify="center" mt="xl">
          <Button color="red" onClick={handleDeleteClass}>Delete</Button>
          <Button variant="default" onClick={close}>Cancel</Button>
        </Group>
      </Modal>
    </>
  );
}
