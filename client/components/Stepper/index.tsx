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
  Progress,
  Select,
  Modal,
} from "@mantine/core";
import { YearPickerInput } from "@mantine/dates";
import { MIME_TYPES, FileWithPath } from "@mantine/dropzone";
import { useForm } from "@mantine/form";
import { useMediaQuery, useDisclosure } from "@mantine/hooks";
import { IconCircleCheck, IconFileSpreadsheet, IconFileTypeCsv, IconFolder, IconPhoto, IconCalendar, IconBackpack, IconPointFilled } from "@tabler/icons-react";
import { v4 as uuid } from "uuid";
import VerticalCard from "../VerticalCard";
import SummaryTable from "../SummaryTable";

import Fancybox from "../Fancybox";
import Dropzone from "../Dropzone";
import classes from "./Stepper.module.css";

type ClazzData = {
  schoolYear: Date | null;
  clazzName: string;
  folderColor: string;
  students: Array<string>;
  photos: Array<File>;
  studentsWithPhotos: Array<{ name: string, photo: FileWithPath, isPhotoValid: boolean, preview: React.ReactElement }>;
};

enum ModalType {
  ConfirmUpload,
  Error,
}

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
  handleDeleteStudent: (index: number) => void;
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

  const [modalType, setModalType] = useState<ModalType | null>(null);
  const [opened, { open, close }] = useDisclosure(false);

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
    handleStudentsDataSubmission,
    handleDeleteStudent,
  } = stateAndHandlers;

  const form = useForm({
    initialValues: {
      schoolYear: clazzData.schoolYear,
      clazzName: clazzData.clazzName,
    },
    validate: {
      schoolYear: (value) => (value && value.getFullYear() <= new Date().getFullYear() ? null : "School year must be filled in and cannot be in the future."),
      clazzName: (value) => (value.trim() ? null : "Class name must be filled in"),
    },
    validateInputOnChange: true,
  });

  useEffect(() => {
    if (active === 0) {
      const isFormValid: boolean = (clazzData.schoolYear ? (clazzData.schoolYear.getFullYear() <= new Date().getFullYear() ? true : false) : false);
      if (nextStepButtonRef.current) {
        nextStepButtonRef.current.disabled = !isFormValid;
      }
    } else if (active === 1) {
      const isFormValid: boolean = clazzData.clazzName.trim() !== "" && clazzData.folderColor !== "";
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

  const openModal = () => {
    if (clazzData.students.length === clazzData.photos.length) {
      setModalType(ModalType.ConfirmUpload);
      open();
    } else {
      setModalType(ModalType.Error);
      open();
    }
  }

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
            onChange={(e) => {
              handlePickYearChange(e);
              form.setFieldValue("schoolYear", e);
            }}
            error={form.errors.schoolYear}
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
            onChange={(e) => {
              handleClassNameChange(e.target.value);
              form.setFieldValue("clazzName", e.target.value);
            }}
            error={form.errors.clazzName}
            required
          />
          {
            !classesInSelectedYear.includes(clazzData.clazzName) && (
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
            )
          }
        </StepperMantine.Step>

        <StepperMantine.Step
          icon={<IconFileTypeCsv style={{ width: rem(18), height: rem(18) }} />}
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
            maxSize={300}
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
          <Title order={1} ta="center">Summary</Title>
          <Text ta="center" mb="xl">{`${clazzData.schoolYear?.getFullYear()} – ${clazzData.clazzName}`}</Text>
          <SummaryTable studentsWithPhotos={clazzData.studentsWithPhotos} handleDeleteStudent={handleDeleteStudent} />
        </StepperMantine.Completed>
      </StepperMantine>

      <Group justify="center" mt="xl">
        <Button variant="default" onClick={prevStep}>Back</Button>
        {
          active === 4 ? (
            <Button onClick={openModal}>Submit</Button>
          ) : (
            <Button ref={nextStepButtonRef} onClick={nextStep}>Next step</Button>
          )
        }
      </Group>

      <Modal
        opened={opened}
        onClose={close}
        title={modalType === ModalType.ConfirmUpload ? "Confirm Upload" : "Data Validation Error"}
        centered
        radius="md"
        zIndex={1000}
      >
        {
          modalType === ModalType.ConfirmUpload ? (
            <>
              All data has been validated and is ready for upload. Are you sure you want to proceed?
              <Group justify="center" mt="xl">
                <Button variant="default" onClick={close}>Cancel</Button>
                <Button onClick={handleStudentsDataSubmission}>Upload</Button>
              </Group>
            </>
          ) : (
            <>
              The data is not valid. This could be due to the number of names not matching the number of photos, or because no face was found in some photos. Please check your data and try again.
              <Group justify="center" mt="xl">
                <Button color="red" onClick={close}>Try Again</Button>
              </Group>
            </>
          )
        }
      </Modal>
    </>
  );
}

export default Stepper;
