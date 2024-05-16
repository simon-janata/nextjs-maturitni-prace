"use client";

import { useTranslations } from "next-intl";
import Link from "next/link";

import { Avatar, Table, UnstyledButton, Badge, rem, ActionIcon, TextInput } from "@mantine/core";
import { IconCheck, IconTrash, IconX, IconAt, IconCircleX, IconCircleCheck } from "@tabler/icons-react";
import { FileWithPath } from "@mantine/dropzone";

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
    isPhotoValid: boolean;
    preview: React.ReactElement;
  }>;
};

interface SummaryTableProps {
  studentsWithPhotos: Array<{
    name: string;
    photo: File;
    isPhotoValid: boolean;
    preview: React.ReactElement;
  }>;
  handleDeleteStudent: (index: number) => void;
  setClazzData: React.Dispatch<React.SetStateAction<ClazzData>>;
}

const SummaryTable: React.FC<SummaryTableProps> = ({ studentsWithPhotos, handleDeleteStudent, setClazzData }) => {
  const t = useTranslations("SummaryTable");

  const rows = studentsWithPhotos.map((row, index) => {
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
            value={studentsWithPhotos[index].name}
            onChange={(e) => {
              // setClazzData((prev) => ({
              //   ...prev,
              //   studentsWithPhotos: prev.studentsWithPhotos.map((student, i) =>
              //     i === index ? { ...student, name: e.currentTarget.value } : student
              //   ),
              // }));
              console.log(e.currentTarget.value);
              // studentsWithPhotos[index].name = e.currentTarget.value
            }}
          >

          </TextInput>
          {row.name}
        </Table.Td>
        <Table.Td>{row.photo.name ? row.photo.name : "..."}</Table.Td>
        <Table.Td ta="center">{Math.floor(Math.random() * 6)}</Table.Td>
        <Table.Td ta="center">
          {row.isPhotoValid ? (
            <Badge classNames={classes} leftSection={<IconCircleCheck style={{ width: rem(16), height: rem(16) }} />} color="green">Valid</Badge>
          ) : (
            <Badge classNames={classes} leftSection={<IconCircleX style={{ width: rem(16), height: rem(16) }} />} color="red">Invalid</Badge>
          )}
        </Table.Td>
        <Table.Td ta="center">
          {/* <UnstyledButton> */}
          <ActionIcon variant="default" aria-label="Delete">
            <IconTrash
              stroke={1.5}
              style={{ width: "70%", height: "70%" }}
              onClick={() => handleDeleteStudent(index)}
            />
          </ActionIcon>
          {/* </UnstyledButton> */}
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
