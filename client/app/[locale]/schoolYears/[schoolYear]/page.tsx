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
  Menu,
  Flex,
  Title,
  UnstyledButton,
  Group,
  Button,
  rem,
  Modal,
  useMantineTheme
} from "@mantine/core";
import { useDocumentTitle, useDisclosure } from "@mantine/hooks";
import axios from "axios";
import { notifications } from "@mantine/notifications";
import { v4 as uuid } from "uuid";
import { IconCheck, IconSettings, IconTrash, IconShare, IconDotsVertical, IconX } from "@tabler/icons-react";
import { useRouter } from "next/navigation";

export default function ClassesPage({ params }: { params: { year: number } }) {
  useDocumentTitle(`School year ${params.year}`);
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations("ClassesPage");
  const p = useTranslations("Pathnames");
  const theme = useMantineTheme();
  const [year, setYear] = useState<Year>();
  const [classes, setClasses] = useState<Class[]>([]);
  const [filteredClasses, setFilteredClasses] = useState<Class[]>([]);
  const [query, setQuery] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);

  const [opened, { open, close }] = useDisclosure(false);

  const breadcrumbsItems = [
    { title: t("breadcrumbs.home"), href: `/${locale}` },
    { title: t("breadcrumbs.schoolYears"), href: `/${locale}/${p("schoolYears")}` },
    { title: `${params.year}`, href: `/${locale}/${p("schoolYears")}/${params.year}` },
  ].map((item, index) => (
    <Anchor component={Link} href={item.href} key={uuid()} c={theme.colors.pslib[6]}>
      {item.title}
    </Anchor>
  ));

  useEffect(() => {
    const dataPromise = axios.get(`${process.env.NEXT_PUBLIC_API_URL}/${process.env.NEXT_PUBLIC_LOCALE}/api/schoolYears/${params.year}`)
    .then((res) => {
      const data = res.data;
      setYear(data);
      setClasses(data.clazzes);
      setFilteredClasses(data.clazzes);
    });

    const timeoutPromise = new Promise(resolve => setTimeout(resolve, 1000));

    Promise.all([dataPromise, timeoutPromise]).then(() => setLoading(false));
  }, []);

  const handleSearch = (searchQuery: string) => {
    setQuery(searchQuery);
    const filteredResults = classes.filter((c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    setFilteredClasses(filteredResults);
  }

  const handleDeleteSchoolYear = async () => {
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/${process.env.NEXT_PUBLIC_LOCALE}/api/photos`, {
        params: {
          year: params.year
        }
      });
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/${process.env.NEXT_PUBLIC_LOCALE}/api/schoolYears/${params.year}`);

      router.push(`/${locale}/schoolYears`);
      notifications.show({
        color: "teal",
        icon: <IconCheck style={{ width: rem(18), height: rem(18) }} />,
        title: "School Year Deleted",
        message: `The school year ${params.year}, along with all its classes, students, and their photos, has been successfully deleted.`,
        autoClose: 4000,
      });
    } catch (err) {
      // console.log(`Error deleting school year - ${err}`);
      router.push(`/${locale}/schoolYears`);
      notifications.show({
        color: "red",
        icon: <IconX style={{ width: rem(18), height: rem(18) }} />,
        title: "School Year Deletion Failed",
        message: `Failed to delete the school year ${params.year}, along with all its classes, students, and their photos. Please try again.`,
        autoClose: 4000,
      });
    }
  };

  return (
    <>
      <Flex
        direction="row"
        justify="space-between"
        align="center"
      >
        <Breadcrumbs items={breadcrumbsItems} />
        <UnstyledButton w={24} h={24} onClick={open}>
          <IconTrash />
        </UnstyledButton>
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
          filteredClasses.length === 0 ? (
            <Center>
              <Title order={1}>No classes found</Title>
            </Center>
          ) : (
            <Grid>
              {
                filteredClasses.map((c) => (
                  <Grid.Col span={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={uuid()}>
                    <DirectoryCard entity={c} type="class" classParameter={params.year} textToHighlight={query} />
                  </Grid.Col>
                ))
              }
            </Grid>
          )
        )
      }

      <Modal opened={opened} onClose={close} title="Delete School Year Confirmation" centered radius="md" zIndex={1000}>
        Are you sure you want to delete this school year? Deleting this school year will also delete all associated classes, students, and their photos. This action cannot be undone. Please confirm your decision.
        <Group justify="center" mt="xl">
          <Button color="red" onClick={handleDeleteSchoolYear}>Delete</Button>
          <Button variant="default" onClick={close}>Cancel</Button>
        </Group>
      </Modal>
    </>
  );
}
