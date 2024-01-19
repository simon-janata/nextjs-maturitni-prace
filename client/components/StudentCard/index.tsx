"use client";

import Link from "next/link";

import { Avatar, Highlight, Modal, Paper, UnstyledButton } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconDownload, IconEdit } from "@tabler/icons-react";

import classes from "./StudentCard.module.css";

interface StudentCardProps {
  student: Student;
  textToHighlight: string;
}

const StudentCard: React.FC<StudentCardProps> = ({ student, textToHighlight }) => {
  const [opened, { open, close }] = useDisclosure(false);

  return (
    <>
      <Paper radius="md" withBorder p="lg" className={classes.studentCard}>
        <UnstyledButton
          style={{ position: "absolute", top: 10, left: 10, height: "24px", width: "24px" }}
          onClick={open}
        >
          <IconEdit stroke={1.5} />
        </UnstyledButton>
        <UnstyledButton
          style={{ position: "absolute", top: 10, right: 10, height: "24px", width: "24px" }}
        >
          <IconDownload stroke={1.5} />
        </UnstyledButton>
        <Link
          style={{ display: "contents", width: "120px" }}
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
        <Highlight color="orange" highlight={textToHighlight} ta="center" fz="lg" fw={500} mt="md">
          {`${student.lastname} ${student.middlename} ${student.firstname}`}
        </Highlight>
      </Paper>

      <Modal opened={opened} onClose={close} title="Edit Student Information" centered zIndex={1000}>
        {/* Modal content */}
      </Modal>
    </>
  );
}

export default StudentCard;
