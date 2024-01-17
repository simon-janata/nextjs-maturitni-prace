"use client";

import Link from "next/link";

import { Avatar, Paper, Text, UnstyledButton } from "@mantine/core";
import { IconDownload } from "@tabler/icons-react";

import classes from "./StudentCard.module.css";

const StudentCard = ({ student }: { student: Student }) => {
  return (
    <Paper radius="md" withBorder p="lg" className={classes.studentCard}>
      <UnstyledButton
        style={{ position: "absolute", top: 10, right: 10 }}
      >
        <IconDownload stroke={1.5} />
      </UnstyledButton>
      <Link
        href="https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-10.png"
        data-fancybox="gallery"
        data-caption={`${student.lastname} ${student.middlename} ${student.firstname}`}
      >
        <Avatar
          src="https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-10.png"
          w={120}
          h="auto"
          radius="md"
          mx="auto"
        />
      </Link>
      <Text ta="center" fz="lg" fw={500} mt="md">
        {student.lastname} {student.middlename} {student.firstname}
      </Text>
    </Paper>
  );
}

export default StudentCard;
