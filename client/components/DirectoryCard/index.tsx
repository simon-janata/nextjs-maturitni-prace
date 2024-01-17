"use client";

import Link from "next/link";

import { Center, Paper, Text } from "@mantine/core";
import { IconFolderFilled } from "@tabler/icons-react";

import classes from "./DirectoryCard.module.css";

interface DirectoryCardProps {
  entity: Year | Class;
  type: "year" | "class";
}

const DirectoryCard: React.FC<DirectoryCardProps> = ({ entity, type }) => {
  const label = type === "year" ? (entity as Year).year : (entity as Class).name;
  const link = type === "year" ? `/years/${entity.id}` : `/classes/${entity.id}`;

  return (
    <Paper component={Link} href={link} radius="md" withBorder p="lg" className={classes.directoryCard}>
      <Center>
        <IconFolderFilled
          size={120}
          style={{ color: type === "year" ? "#fcbc19" : `${(entity as Class).folderColor}` }}
        />
      </Center>
      <Text ta="center" fz="lg" fw={500} mt="md">
        {label}
      </Text>
    </Paper>
  );
}

export default DirectoryCard;
