"use client";

import Link from "next/link";

import { Avatar, Paper, Text } from "@mantine/core";

const StudentCard = ({ student }: { student: Student }) => {
  return (
    <Paper radius="md" withBorder p="lg" bg="var(--mantine-color-body)">
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
