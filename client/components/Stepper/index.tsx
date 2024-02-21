"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { useLocale, useTranslations } from "next-intl";

import {
  Button, ColorInput, Group,
  SimpleGrid,
  List,
  Grid,
  Image,
  Paper,
  Text,
  Stack,
  Flex,
  Box,
  Card, Badge,
  ColorSwatch,
  Center,
  Divider,
  Stepper as StepperMantine,
  TextInput, Title,
  rem,
  Progress
} from "@mantine/core";
import { YearPickerInput } from "@mantine/dates";
import { MIME_TYPES, FileWithPath } from "@mantine/dropzone";
import { useForm } from "@mantine/form";
import { useMediaQuery } from "@mantine/hooks";
import { IconCircleCheck, IconFileSpreadsheet, IconFolder, IconPhoto, IconCalendar, IconBackpack, IconPointFilled } from "@tabler/icons-react";
import { v4 as uuid } from "uuid";

import Fancybox from "../Fancybox";
import Dropzone from "../Dropzone";
import classes from "./Stepper.module.css";

type ClazzData = {
  schoolYear: Date | null;
  clazzName: string;
  folderColor: string;
  students: Array<string>;
  photos: Array<File>;
  studentsWithPhotos: Array<{ name: string, photo: FileWithPath, preview: React.ReactNode }>;
};

type StateAndHandlers = {
  active: number;
  setActive: React.Dispatch<React.SetStateAction<number>>;
  nextStep: () => void;
  prevStep: () => void;
  clazzData: ClazzData;
  setClazzData: React.Dispatch<React.SetStateAction<ClazzData>>;
  classesInSelectedYear: string[];
  previews: React.ReactNode[];
  handlePickYearChange: (date: Date | null) => void;
  handleClassNameChange: (n: string) => void;
  handleFolderColorChange: (color: string) => void;
  handleCSVUpload: (files: File) => void;
  handlePhotosUpload: (files: FileWithPath[]) => void;
  handleStudentsDataSubmission: () => void;
}

type StepperProps = {
  stateAndHandlers: StateAndHandlers;
}

const Stepper: React.FC<StepperProps> = ({ stateAndHandlers }) => {
  const locale = useLocale();
  const t = useTranslations("Stepper");
  const isMobile = useMediaQuery("(max-width: 52em)");
  const mimeTypesCSV = [MIME_TYPES.csv];
  const mimeTypesPhotos = [MIME_TYPES.png, MIME_TYPES.jpeg, MIME_TYPES.webp];

  const nextStepButtonRef: React.RefObject<HTMLButtonElement> = useRef(null);

  const [value, setValue] = useState<number>(50);

  const {
    active,
    setActive,
    nextStep,
    prevStep,
    clazzData,
    setClazzData,
    classesInSelectedYear,
    previews,
    handlePickYearChange,
    handleClassNameChange,
    handleFolderColorChange,
    handleCSVUpload,
    handlePhotosUpload,
    handleStudentsDataSubmission
  } = stateAndHandlers;

  useEffect(() => {
    if (active === 0) {
      const isFormValid: boolean = clazzData.schoolYear !== null;
      if (nextStepButtonRef.current) {
        nextStepButtonRef.current.disabled = !isFormValid;
      }
    } else if (active === 1) {
      const isFormValid: boolean = clazzData.clazzName !== "" && clazzData.folderColor !== "";
      if (nextStepButtonRef.current) {
        nextStepButtonRef.current.disabled = !isFormValid;
      }
    } else if (active === 2) {
      const isFormValid: boolean = clazzData.students.length > 0;
      if (nextStepButtonRef.current) {
        nextStepButtonRef.current.disabled = !isFormValid;
      }
    } else if (active === 3) {
      const isFormValid: boolean = clazzData.photos.length > 0;
      if (nextStepButtonRef.current) {
        nextStepButtonRef.current.disabled = !isFormValid;
      }
    }
  }, [active, clazzData]);

  return (
    <>
      <StepperMantine
        active={active}
        onStepClick={setActive}
        allowNextStepsSelect={false}
        completedIcon={<IconCircleCheck style={{ width: rem(18), height: rem(18) }} />}
        w="100%"
        classNames={classes}
        orientation={isMobile ? "vertical" : "horizontal"}
      >
        <StepperMantine.Step
          icon={<IconFolder style={{ width: rem(18), height: rem(18) }} />}
          label={t("firstStep.label")}
          description={t("firstStep.description")}
        >
          <YearPickerInput
            label="Pick year"
            value={clazzData.schoolYear}
            onChange={(e) => handlePickYearChange(e)}
            required
          />
        </StepperMantine.Step>

        <StepperMantine.Step
          icon={<IconFolder style={{ width: rem(18), height: rem(18) }} />}
          label={t("secondStep.label")}
          description={t("secondStep.description")}
        >
          <TextInput
            mb={rem(16)}
            label="Enter class name"
            placeholder="Enter class name"
            value={clazzData.clazzName}
            onChange={(e) => handleClassNameChange(e.target.value)}
            required
          />
          <ColorInput
            label="Pick folder colour"
            format="hex"
            swatches={["#fcbc19", "#4154fa", "#429fe3", "#e34242", "#3cab68", "#e3a342", "#9c42e3", "#436a68"]}
            swatchesPerRow={8}
            defaultValue={clazzData.folderColor}
            onChange={(color) => handleFolderColorChange(color)}
            disallowInput
            required
          />
        </StepperMantine.Step>

        <StepperMantine.Step
          icon={<IconFileSpreadsheet style={{ width: rem(18), height: rem(18) }} />}
          label={t("thirdStep.label")}
          description={t("thirdStep.description")}
        >
          <Dropzone
            acceptedMimeTypes={mimeTypesCSV}
            maxSize={2}
            multiple={false}
            idle="Upload CSV file of students"
            typesString={[".csv"]}
            handleCSVUpload={handleCSVUpload}
          />
          {
            clazzData.students.length > 0 && (
              <Stack mt={rem(48)}>
                {
                  clazzData.students.map((student) => {
                    return (
                      <Center>
                        <Text>{student}</Text>
                      </Center>
                    )
                  })
                }
              </Stack>
            )
          }
        </StepperMantine.Step>

        <StepperMantine.Step
          icon={<IconPhoto style={{ width: rem(18), height: rem(18) }} />}
          label={t("fourthStep.label")}
          description={t("fourthStep.description")}
        >
          <Dropzone
            acceptedMimeTypes={mimeTypesPhotos}
            maxSize={180}
            multiple={true}
            idle="Upload photos of students"
            typesString={[".png", ".jpeg", ".webp"]}
            handlePhotosUpload={handlePhotosUpload}
          />
          {
            clazzData.studentsWithPhotos.length > 0 && (
              <Fancybox
                options={{
                  Carousel: {
                    infinite: false,
                  },
                }}
              >
                <Grid mt={rem(48)}>
                  {
                    clazzData.studentsWithPhotos.map((s) => (
                      <Grid.Col span={{ base: 6, xs: 3, sm: 2.4, md: 2, lg: 1.5 }} key={uuid()}>
                        {
                          s.preview
                        }
                      </Grid.Col>
                    ))
                  }
                </Grid>
              </Fancybox>
            )
          }
        </StepperMantine.Step>
        <StepperMantine.Completed>
          <Title order={1} ta="center">Completed</Title>
          <Text ta="center" mt="xl">{value}</Text>
          <Progress.Root size="lg" mt="sm">
            <Progress.Section value={value} color="green" style={{ transitionDuration: "200ms" }}>
            </Progress.Section>
          </Progress.Root>
          <Center>
            <Button onClick={() => setValue(Math.round(Math.random() * 100))} mt="md">
              Set random value
            </Button>
          </Center>
        </StepperMantine.Completed>
      </StepperMantine>

      <Group justify="center" mt="xl">
        <Button variant="default" onClick={prevStep}>Back</Button>
        {
          active === 4 ? (
            <Button onClick={() => handleStudentsDataSubmission()}>Submit</Button>
          ) : (
            <Button ref={nextStepButtonRef} onClick={nextStep}>Next step</Button>
          )
        }
      </Group>
    </>
  );
}

export default Stepper;
