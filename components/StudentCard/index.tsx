"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
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

const StudentCard: React.FC<StudentCardProps> = ({ student, textToHighlight }) => {
  const t = useTranslations("StudentCard");
  const [isHovered, setIsHovered] = useState<boolean>(false);

  return (
    <Paper radius="md" withBorder p="lg" className={`${classes.studentCard} ${isHovered ? classes.hovered : ""}`}>
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
            title: t("notification.title"),
            message: t("notification.message"),
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
        style={{ display: "contents" }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        href={
          student.photo === undefined
            ? `https://fakeimg.pl/1050x1400?text=${t("photoNotFound")}`
            : student.photo
        }
        data-fancybox="gallery"
        data-caption={`${student.lastname} ${student.middlename} ${student.firstname}`}
      >
        <Image
          src={student.photo}
          fallbackSrc={`https://fakeimg.pl/1050x1400?text=${t("photoNotFound")}`}
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
