"use client";

import Link from "next/link";
import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";

import {
  Button, ColorInput, Group,
  SimpleGrid,
  List,
  Grid,
  Image,
  Paper,
  Text,
  Flex,
  Box,
  Card, Badge,
  ColorSwatch,
  Center,
  Divider,
  Stepper as StepperMantine,
  TextInput, Title,
  rem
} from "@mantine/core";
import { YearPickerInput } from "@mantine/dates";
import { MIME_TYPES, FileWithPath } from "@mantine/dropzone";
import { useForm } from "@mantine/form";
import { useMediaQuery } from "@mantine/hooks";
import { IconCircleCheck, IconFileSpreadsheet, IconFolder, IconPhoto, IconCalendar, IconBackpack, IconPointFilled } from "@tabler/icons-react";

import Fancybox from "../Fancybox";
import Dropzone from "../Dropzone";
import classes from "./Stepper.module.css";

type ClazzData = {
  schoolYear: Date | null;
  clazzName: string;
  folderColor: string;
  students: Array<string>;
  photos: Array<File>;
  studentsWithPhotos: Array<{ name: string, photo: string, preview: React.ReactNode }>;
};

type StateAndHandlers = {
  active: number;
  setActive: React.Dispatch<React.SetStateAction<number>>;
  clazzData: ClazzData;
  setClazzData: React.Dispatch<React.SetStateAction<ClazzData>>;
  classesInSelectedYear: string[];
  previews: React.ReactNode[];
  nextStep: () => void;
  prevStep: () => void;
  handlePickYearChange: (date: Date | null) => void;
  handleClassNameChange: (n: string) => void;
  handleFolderColorChange: (color: string) => void;
  handleCSVUpload: (files: File) => void;
  handlePhotosUpload: (files: FileWithPath[]) => void;
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

  return (
    <>
      <StepperMantine
        active={stateAndHandlers.active}
        onStepClick={stateAndHandlers.setActive}
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
            value={stateAndHandlers.clazzData.schoolYear}
            onChange={(e) => stateAndHandlers.handlePickYearChange(e)}
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
            value={stateAndHandlers.clazzData.clazzName}
            onChange={(e) => stateAndHandlers.handleClassNameChange(e.target.value)}
            required
          />
          <ColorInput
            label="Pick folder colour"
            format="hex"
            swatches={["#fcbc19", "#4154fa", "#429fe3", "#e34242", "#3cab68", "#e3a342", "#9c42e3", "#436a68"]}
            swatchesPerRow={8}
            defaultValue={stateAndHandlers.clazzData.folderColor}
            onChange={(color) => stateAndHandlers.handleFolderColorChange(color)}
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
            handleCSVUpload={stateAndHandlers.handleCSVUpload}
          />
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
            handlePhotosUpload={stateAndHandlers.handlePhotosUpload}
          />
          {
            stateAndHandlers.clazzData.students
          }
          <Fancybox
            options={{
              Carousel: {
                infinite: false,
              },
            }}
          >
            <SimpleGrid cols={{ base: 1, sm: 6 }} mt={stateAndHandlers.previews.length > 0 ? "xl" : 0}>    
              {
                stateAndHandlers.clazzData.studentsWithPhotos.map((student) => {
                  return (
                    student.preview
                  )
                })
              }
            </SimpleGrid>
          </Fancybox>
        </StepperMantine.Step>
      </StepperMantine>

      <Group justify="center" mt={rem(64)}>
        <Button variant="default" onClick={stateAndHandlers.prevStep}>Back</Button>
        <Button onClick={stateAndHandlers.nextStep}>Next step</Button>
        {/* {
          stateAndHandlers.active === 3 ? (
            <Button component={Link} href={`/${locale}`}>Submit</Button>
          ) : (
            <Button onClick={stateAndHandlers.nextStep}>Next step</Button>
          )
        } */}
      </Group>
    </>
  );
}

export default Stepper;
