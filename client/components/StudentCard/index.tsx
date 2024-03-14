"use client";

import Link from "next/link";
import Base64Downloader from "react-base64-downloader";

import { Highlight, Image, Paper, rem, UnstyledButton } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { IconDownload, IconX } from "@tabler/icons-react";

import classes from "./StudentCard.module.css";

interface StudentCardProps {
  student: StudentWithPhoto;
  textToHighlight: string;
}

const StudentCard: React.FC<StudentCardProps> = ({
  student,
  textToHighlight,
}) => {
  return (
    <Paper radius="md" withBorder p="lg" className={classes.studentCard}>
      <UnstyledButton
        component={Base64Downloader}
        base64={student.photo}
        downloadName={`${student.lastname}${
          student.middlename ? `_${student.middlename}` : ""
        }_${student.firstname}`}
        style={{
          position: "absolute",
          top: rem(10),
          right: rem(10),
          height: "22px",
          width: "22px",
        }}
        onDownloadError={() =>
          notifications.show({
            color: "red",
            icon: <IconX style={{ width: rem(18), height: rem(18) }} />,
            title: "Photo Download Failed",
            message: "The photo could not be downloaded. Please try again.",
            autoClose: 4000,
          })
        }
      >
        <IconDownload
          style={{ width: rem(22), height: rem(22) }}
          stroke={1.5}
        />
      </UnstyledButton>
      <Link
        style={{ display: "contents", width: "120px" }}
        href={
          student.photo === undefined
            ? "https://fakeimg.pl/1050x1400?text=Not+found"
            : student.photo
        }
        data-fancybox="gallery"
        data-caption={`${student.lastname} ${student.middlename} ${student.firstname}`}
      >
        <Image
          src={student.photo}
          fallbackSrc="https://fakeimg.pl/1050x1400?text=Not+found"
          w={120}
          h="auto"
          radius="md"
          mx="auto"
        />
      </Link>
      <Highlight
        highlight={textToHighlight}
        ta="center"
        fz="lg"
        fw={500}
        mt="md"
      >
        {`${student.lastname} ${student.middlename} ${student.firstname}`}
      </Highlight>
    </Paper>
  );
};

export default StudentCard;
