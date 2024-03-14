"use client";

import axios from "axios";
import { saveAs } from "file-saver";
import JSZip from "jszip";
import { useLocale, useTranslations } from "next-intl";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { v4 as uuid } from "uuid";

import Breadcrumbs from "@/components/Breadcrumbs";
import Fancybox from "@/components/Fancybox";
import SearchBar from "@/components/SearchBar";
import StudentCard from "@/components/StudentCard";
import {
  Anchor,
  Button,
  Center,
  Flex,
  Grid,
  Group,
  Loader,
  Menu,
  Modal,
  rem,
  Title,
  UnstyledButton,
  useMantineTheme,
} from "@mantine/core";
import { useDisclosure, useDocumentTitle } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import {
  IconCheck,
  IconDotsVertical,
  IconFileZip,
  IconTrash,
  IconX,
} from "@tabler/icons-react";

export default function ClazzPage({ params }: { params: { schoolYear: number; clazz: string } }) {
  const t = useTranslations("StudentsPage");
  useDocumentTitle(
    `${t("tabTitle")} ${params.clazz.toUpperCase()} (${params.schoolYear})`
  );
  const router = useRouter();
  const locale = useLocale();
  const p = useTranslations("Pathnames");
  const theme = useMantineTheme();
  const [students, setStudents] = useState<StudentWithPhoto[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<StudentWithPhoto[]>(
    []
  );
  const [query, setQuery] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);

  const [opened, { open, close }] = useDisclosure(false);

  const breadcrumbsItems: JSX.Element[] = [
    { title: t("breadcrumbs.home"), href: `/${locale}` },
    {
      title: t("breadcrumbs.schoolYears"),
      href: `/${locale}/${p("schoolYears")}`,
    },
    {
      title: `${params.schoolYear}`,
      href: `/${locale}/${p("schoolYears")}/${params.schoolYear}`,
    },
    {
      title: `${params.clazz.toUpperCase()}`,
      href: `/${locale}/${p("schoolYears")}/${params.schoolYear}/${p(
        "clazzes"
      )}/${params.clazz}`,
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
      .get(
        `${process.env.NEXT_PUBLIC_API_URL}/cs/api/clazzes/${params.clazz}`,
        {
          params: {
            schoolYear: params.schoolYear,
          },
        }
      )
      .then((res) => {
        const data = res.data;
        const students: Array<StudentWithPhoto> = data.students;

        return Promise.all(
          students.map((s) =>
            axios
              .get(`${process.env.NEXT_PUBLIC_API_URL}/cs/api/photos`, {
                params: {
                  schoolYear: params.schoolYear,
                  clazzName: params.clazz,
                  studentName: `${s.lastname}${
                    s.middlename ? `_${s.middlename}` : ""
                  }_${s.firstname}`,
                },
              })
              .then((res) => ({ ...s, photo: res.data.image }))
              .catch((err) => {
                console.log(err);
                return s;
              })
          )
        ).then((updatedStudents) => {
          setStudents(updatedStudents);
          setFilteredStudents(updatedStudents);
        });
      });

    const timeoutPromise = new Promise((resolve) => setTimeout(resolve, 1000));

    Promise.all([dataPromise, timeoutPromise]).then(() => setLoading(false));
  }, []);

  const handleSearch = (searchQuery: string) => {
    setQuery(searchQuery);
    const filteredResults = students.filter(
      (s) =>
        s.lastname.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.middlename.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.firstname.toLowerCase().includes(searchQuery.toLowerCase())
    );

    setFilteredStudents(filteredResults);
  };

  const handleDownloadAllPhotos = () => {
    try {
      const zip = new JSZip();

      students.forEach((s) => {
        console.log(s);
        zip.file(
          `${s.lastname}${s.middlename ? `_${s.middlename}` : ""}_${
            s.firstname
          }.jpeg`,
          s.photo.replace("data:image/jpeg;base64,", ""),
          { base64: true }
        );
      });

      zip.generateAsync({ type: "blob" }).then(function (content) {
        saveAs(
          content,
          `${params.schoolYear}_${params.clazz.toUpperCase()}.zip`
        );
      });
    } catch (error) {
      notifications.show({
        color: "red",
        icon: <IconX style={{ width: rem(18), height: rem(18) }} />,
        title: t("nottification.zipDownloadFailed.title"),
        message: t("nottification.zipDownloadFailed.message"),
        autoClose: 4000,
      });
    }
  };

  const handleDeleteClass = async () => {
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/cs/api/photos`, {
        params: {
          schoolYear: params.schoolYear,
          clazzName: params.clazz,
        },
      });
      await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/cs/api/clazzes/${params.clazz}`,
        {
          params: {
            schoolYear: params.schoolYear,
          },
        }
      );

      router.push(`/${locale}/schoolYears/${params.schoolYear}`);
      notifications.show({
        color: "teal",
        icon: <IconCheck style={{ width: rem(18), height: rem(18) }} />,
        title: t("nottification.deleteSuccess.title"),
        message: t("nottification.deleteSuccess.message", { clazz: params.clazz.toUpperCase(), schoolYear: params.schoolYear }),
        autoClose: 4000,
      });
    } catch (err) {
      router.push(`/${locale}/schoolYears/${params.schoolYear}`);
      notifications.show({
        color: "red",
        icon: <IconX style={{ width: rem(18), height: rem(18) }} />,
        title: t("nottification.deleteError.title"),
        message: t("nottification.deleteError.message", { clazz: params.clazz.toUpperCase(), schoolYear: params.schoolYear }),
        autoClose: 4000,
      });
    }
  };

  return (
    <>
      <Flex direction="row" justify="space-between" align="center">
        <Breadcrumbs items={breadcrumbsItems} />
        <Menu shadow="md" width={250} position="bottom-end" withArrow>
          <Menu.Target>
            <UnstyledButton w={24} h={24}>
              <IconDotsVertical />
            </UnstyledButton>
          </Menu.Target>

          <Menu.Dropdown>
            <Menu.Item
              leftSection={
                <IconFileZip style={{ width: rem(14), height: rem(14) }} />
              }
              onClick={handleDownloadAllPhotos}
            >
              {t("dropdown.downloadZip")}
            </Menu.Item>
            <Menu.Item
              color="red"
              leftSection={
                <IconTrash style={{ width: rem(14), height: rem(14) }} />
              }
              onClick={open}
            >
              {t("dropdown.deleteClass")}
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </Flex>

      <SearchBar
        placeholder={t("searchBar.placeholder")}
        handleSearch={handleSearch}
      />

      {loading === true ? (
        <Center>
          <Loader color={theme.colors.pslib[6]} />
        </Center>
      ) : filteredStudents.length === 0 ? (
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
            {filteredStudents.map((s) => (
              <Grid.Col span={{ xs: 12, sm: 6, md: 4 }} key={uuid()}>
                <StudentCard student={s} textToHighlight={query} />
              </Grid.Col>
            ))}
          </Grid>
        </Fancybox>
      )}

      <Modal
        opened={opened}
        onClose={close}
        title={t("modal.title")}
        centered
        radius="md"
        zIndex={1000}
      >
        {t("modal.text")}
        <Group justify="center" mt="xl">
          <Button color="red" onClick={handleDeleteClass}>
            {t("modal.leftButton")}
          </Button>
          <Button variant="default" onClick={close}>
            {t("modal.rightButton")}
          </Button>
        </Group>
      </Modal>
    </>
  );
}
