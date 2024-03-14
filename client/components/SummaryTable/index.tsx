"use client";

import Link from "next/link";

import { Avatar, Table, UnstyledButton } from "@mantine/core";
import { IconCheck, IconTrash, IconX } from "@tabler/icons-react";

import Fancybox from "../Fancybox";

interface SummaryTableProps {
  studentsWithPhotos: Array<{
    name: string;
    photo: File;
    isPhotoValid: boolean;
    preview: React.ReactElement;
  }>;
  handleDeleteStudent: (index: number) => void;
}

const SummaryTable: React.FC<SummaryTableProps> = ({ studentsWithPhotos, handleDeleteStudent }) => {
  const rows = studentsWithPhotos.map((row, index) => {
    return (
      <Table.Tr key={index}>
        <Table.Td>
          <Link
            href={row.preview.props.href || ""}
            data-fancybox="gallery"
            data-caption={`${row.name}`}
          >
            <Avatar size={60} src={row.preview.props.href || ""} />
          </Link>
        </Table.Td>
        <Table.Td>{row.name}</Table.Td>
        <Table.Td>{row.photo.name ? row.photo.name : "..."}</Table.Td>
        <Table.Td ta="center">
          {row.isPhotoValid ? (
            <IconCheck stroke={1.5} color="green" />
          ) : (
            <IconX stroke={1.5} color="red" />
          )}
        </Table.Td>
        <Table.Td ta="center">
          <UnstyledButton>
            <IconTrash
              stroke={1.5}
              onClick={() => handleDeleteStudent(index)}
            />
          </UnstyledButton>
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
              <Table.Th>Student Name</Table.Th>
              <Table.Th>Uploaded Photo Name</Table.Th>
              <Table.Th ta="center">Photo Validity (One Face)</Table.Th>
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
