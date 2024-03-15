"use client";

import { useLocale, useTranslations } from "next-intl";
import Link from "next/link";

import { Center, Highlight, Paper } from "@mantine/core";
import { IconFolderFilled } from "@tabler/icons-react";

import classes from "./DirectoryCard.module.css";

interface DirectoryCardProps {
  entity: SchoolYear | Clazz;
  model: "schoolYear" | "clazz";
  clazzNameParam?: number;
  textToHighlight: string;
}

const DirectoryCard: React.FC<DirectoryCardProps> = ({ entity, model, clazzNameParam, textToHighlight }) => {
  const locale = useLocale();
  const p = useTranslations("Pathnames");

  const label =
    model === "schoolYear" ? (entity as SchoolYear).year : (entity as Clazz).name;
  const link =
    model === "schoolYear"
      ? `/${locale}/${p("schoolYears")}/${(entity as SchoolYear).year}`
      : `/${locale}/${p("schoolYears")}/${clazzNameParam}/${p("clazzes")}/${(
          entity as Clazz
        ).name.toLowerCase()}`;

  return (
    <Paper
      component={Link}
      href={link}
      radius="md"
      withBorder
      p="lg"
      className={classes.directoryCard}
    >
      <Center>
        <IconFolderFilled
          size={120}
          style={{
            color:
              model === "schoolYear" ? "#fcbc19" : `${(entity as Clazz).folderColor}`,
          }}
        />
      </Center>
      <Highlight
        highlight={textToHighlight}
        ta="center"
        fz="lg"
        fw={500}
        mt="md"
      >
        {`${label}`}
      </Highlight>
    </Paper>
  );
};

export default DirectoryCard;
