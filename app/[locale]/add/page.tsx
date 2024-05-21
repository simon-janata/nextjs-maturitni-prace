"use client";

import { useTranslations } from "next-intl";

import Dots from "@/components/MainBanner/Dots";
import classes from "@/components/MainBanner/MainBanner.module.css";
import RingProgress from "@/components/RingProgress";
import Stepper from "@/components/Stepper";
import { ClazzDataContextProvider, useClazzData } from "@/providers/ClazzDataContextProvider";
import { Container, Flex } from "@mantine/core";
import { useDocumentTitle } from "@mantine/hooks";

const AddPageHelper = () => {
  const t = useTranslations("AddPage");

  const {
    uploading,
    schoolYearProgress,
    clazzProgress,
    studentsProgress,
    photosProgress,
  } = useClazzData();

  return (
    <>
      {uploading === true ? (
        <Container className={classes.wrapper}>
          <Dots className={classes.dots} style={{ left: 0, top: 0 }} />
          <Dots className={classes.dots} style={{ left: 100, top: 0 }} />
          <Dots className={classes.dots} style={{ left: 200, top: 0 }} />
          <Dots className={classes.dots} style={{ left: 0, top: 40 }} />
          <Dots className={classes.dots} style={{ right: 0, top: 0 }} />
          <Dots className={classes.dots} style={{ right: 100, top: 0 }} />
          <Dots className={classes.dots} style={{ right: 160, top: 0 }} />
          <Dots className={classes.dots} style={{ right: 0, top: 40 }} />

          <div className={classes.inner}>
            <Flex direction="column" justify="center">
              <Flex
                direction={{ base: "column", sm: "row" }}
                justify={{ base: "center", md: "space-between" }}
                align={{ base: "center", md: "center" }}
              >
                <RingProgress
                  value={schoolYearProgress}
                  label={t("schoolYearProgress")}
                />
                <RingProgress
                  value={clazzProgress}
                  label={t("clazzProgress")}
                />
                <RingProgress
                  value={studentsProgress}
                  label={t("studentsProgress")}
                />
                <RingProgress
                  value={photosProgress}
                  label={t("photosProgress")}
                />
              </Flex>
            </Flex>
          </div>
        </Container>
      ) : (
        <>
          <Stepper />
        </>
      )}
    </>
  );
};

export default function AddPage() {
  const t = useTranslations("AddPage");
  useDocumentTitle(`${t("tabTitle")}`);

  return (
    <ClazzDataContextProvider>
      <AddPageHelper />
    </ClazzDataContextProvider>
  );
}
