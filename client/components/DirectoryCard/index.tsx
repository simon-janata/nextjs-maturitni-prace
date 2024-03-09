"use client";

import Link from "next/link";

import { Center, Highlight, Paper } from "@mantine/core";
import { IconFolderFilled } from "@tabler/icons-react";
import { useLocale, useTranslations } from "next-intl";

import classes from "./DirectoryCard.module.css";

interface DirectoryCardProps {
  entity: SchoolYear | Clazz;
  type: "year" | "class";
  classParameter?: number;
  textToHighlight: string;
}

const DirectoryCard: React.FC<DirectoryCardProps> = ({ entity, type, classParameter, textToHighlight }) => {
  const locale = useLocale();
  const p = useTranslations("Pathnames");

  const label = type === "year" ? (entity as SchoolYear).year : (entity as Clazz).name;
  const link = type === "year" ? `/${locale}/${p("schoolYears")}/${(entity as SchoolYear).year}` : `/${locale}/${p("schoolYears")}/${classParameter}/${p("clazzes")}/${(entity as Clazz).name.toLowerCase()}`;

  return (
    <Paper component={Link} href={link} radius="md" withBorder p="lg" className={classes.directoryCard}>
      <Center>
        <IconFolderFilled
          size={120}
          style={{ color: type === "year" ? "#fcbc19" : `${(entity as Clazz).folderColor}` }}
        />
      </Center>
      <Highlight highlight={textToHighlight} ta="center" fz="lg" fw={500} mt="md">
        {`${label}`}
      </Highlight>
    </Paper>
  );
}

export default DirectoryCard;
