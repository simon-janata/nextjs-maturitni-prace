"use client";

import { useTranslations } from "next-intl";
import Link from "next/link";

import { useClazzData } from "@/providers/ClazzDataContextProvider";
import { ActionIcon, Avatar, Badge, rem, Table, TextInput } from "@mantine/core";
import { FileWithPath } from "@mantine/dropzone";
import { useForm } from "@mantine/form";
import { IconCircleCheck, IconCircleX, IconTrash } from "@tabler/icons-react";

import Fancybox from "../Fancybox";
import classes from "./SummaryTable.module.css";

type ClazzData = {
  schoolYear: Date | null;
  clazzName: string;
  folderColor: string;
  students: Array<string>;
  photos: Array<FileWithPath>;
  studentsWithPhotos: Array<{
    name: string;
    photo: File;
    amountOfFaces: number;
    preview: React.ReactElement;
  }>;
};

const SummaryTable = () => {
  const t = useTranslations("SummaryTable");

  const { clazzData, handleDeleteStudent, handleStudentNameChange } = useClazzData();
  const { studentsWithPhotos } = clazzData;

  const rows = studentsWithPhotos.map((row, index) => {
    const form = useForm({
      initialValues: {
        studentName: row.name,
      },
      validate: {
        studentName: (value) => 
          value.split(" ").length > 1 && value.split(" ").length < 4 && !value.split(" ").some(p => p === "")
            ? null
            : t("form.studentName.errorMessage"),
      },
      validateInputOnChange: true,
    });

    return (
      <Table.Tr key={index}>
        <Table.Td>
          <Link
            href={row.preview.props.href || ""}
            data-fancybox="gallery"
            data-caption={`${row.photo.name}`}
          >
            <Avatar size={60} src={row.preview.props.href || ""} />
          </Link>
        </Table.Td>
        <Table.Td>
          <TextInput

            value={row.name}
            onChange={(e) => {
              // setClazzData((prev) => ({
              //   ...prev,
              //   studentsWithPhotos: prev.studentsWithPhotos.map((student, i) =>
              //     i === index ? { ...student, name: e.currentTarget.value } : student
              //   ),
              // }));
              handleStudentNameChange(index, e.currentTarget.value);
              form.setFieldValue("studentName", e.currentTarget.value);
              // console.log(e.currentTarget.value);
              // studentsWithPhotos[index].name = e.currentTarget.value
            }}
            error={form.errors.studentName}
          >

          </TextInput>
          {/* {row.name} */}
        </Table.Td>
        <Table.Td>{row.photo.name ? row.photo.name : "..."}</Table.Td>
        {/* <Table.Td ta="center">{Math.floor(Math.random() * 6)}</Table.Td> */}
        <Table.Td ta="center">{row.amountOfFaces}</Table.Td>
        <Table.Td ta="center">
          {row.amountOfFaces === 1 ? (
            <Badge classNames={classes} leftSection={<IconCircleCheck style={{ width: rem(16), height: rem(16) }} />} color="green">Valid</Badge>
          ) : (
            <Badge classNames={classes} leftSection={<IconCircleX style={{ width: rem(16), height: rem(16) }} />} color="red">Invalid</Badge>
          )}
        </Table.Td>
        <Table.Td ta="center">
          <ActionIcon variant="default" aria-label="Delete">
            <IconTrash
              stroke={1.5}
              style={{ width: "70%", height: "70%" }}
              onClick={() => handleDeleteStudent(index)}
            />
          </ActionIcon>
        </Table.Td>
      </Table.Tr>
    );
  });

  return (
    <Fancybox
      options={{
        Carousel: {
          infinite: false,
        },
      }}
    >
      <Table.ScrollContainer minWidth={800}>
        <Table verticalSpacing="xs">
          <Table.Thead>
            <Table.Tr>
              <Table.Th></Table.Th>
              <Table.Th>{t("secondColumn")}</Table.Th>
              <Table.Th>{t("thirdColumn")}</Table.Th>
              <Table.Th ta="center">{t("fourthColumn")}</Table.Th>
              <Table.Th ta="center">{t("fifthColumn")}</Table.Th>
              <Table.Th ta="center"></Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>{rows}</Table.Tbody>
        </Table>
      </Table.ScrollContainer>
    </Fancybox>
  );
};

export default SummaryTable;
