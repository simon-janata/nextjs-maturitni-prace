"use client";

import Link from "next/link";

import { Center, Highlight, Paper } from "@mantine/core";
import { IconFolderFilled } from "@tabler/icons-react";
import { useLocale, useTranslations } from "next-intl";

import classes from "./DirectoryCard.module.css";

interface DirectoryCardProps {
  entity: Year | Class;
  type: "year" | "class";
  classParameter?: number;
  textToHighlight: string;
}

const DirectoryCard: React.FC<DirectoryCardProps> = ({ entity, type, classParameter, textToHighlight }) => {
  const locale = useLocale();
  const p = useTranslations("Pathnames");

  const label = type === "year" ? (entity as Year).year : (entity as Class).name;
  const link = type === "year" ? `/${locale}/${p("years")}/${(entity as Year).year}` : `/${locale}/${p("years")}/${classParameter}/${p("classes")}/${(entity as Class).name.toLowerCase()}`;

  return (
    <Paper component={Link} href={link} radius="md" withBorder p="lg" className={classes.directoryCard}>
      <Center>
        <IconFolderFilled
          size={120}
          style={{ color: type === "year" ? "#fcbc19" : `${(entity as Class).folderColor}` }}
        />
      </Center>
      <Highlight highlight={textToHighlight} ta="center" fz="lg" fw={500} mt="md">
        {`${label}`}
      </Highlight>
    </Paper>
  );
}

export default DirectoryCard;
