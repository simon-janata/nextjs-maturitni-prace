"use client";

import Link from "next/link";

import { Highlight, Image, Paper, UnstyledButton, rem } from "@mantine/core";
import { IconDownload, IconShare } from "@tabler/icons-react";

import classes from "./StudentCard.module.css";

interface StudentCardProps {
  student: Student;
  textToHighlight: string;
}

const StudentCard: React.FC<StudentCardProps> = ({ student, textToHighlight }) => {

  return (
    <Paper radius="md" withBorder p="lg" className={classes.studentCard}>
      <UnstyledButton
        style={{ position: "absolute", top: rem(10), right: rem(10), height: "22px", width: "22px" }}
      >
        <IconShare style={{ width: rem(22), height: rem(22) }} stroke={1.5} />
      </UnstyledButton>
      <UnstyledButton
        style={{ position: "absolute", top: rem(10), left: rem(10), height: "22px", width: "22px" }}
      >
        <IconDownload style={{ width: rem(22), height: rem(22) }} stroke={1.5} />
      </UnstyledButton>
      <Link
        style={{ display: "contents", width: "120px" }}
        href="https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-10.png"
        data-fancybox="gallery"
        data-caption={`${student.lastname} ${student.middlename} ${student.firstname}`}
      >
        <Image
          src="https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-10.png"
          fallbackSrc="https://fakeimg.pl/1050x1400?text=Not+found"
          w={120}
          h="auto"
          radius="md"
          mx="auto"
        />
      </Link>
      <Highlight highlight={textToHighlight} ta="center" fz="lg" fw={500} mt="md">
        {`${student.lastname} ${student.middlename} ${student.firstname}`}
      </Highlight>
    </Paper>
  );
}

export default StudentCard;
