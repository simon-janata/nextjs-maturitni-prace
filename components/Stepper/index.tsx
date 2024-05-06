"use client";

import { useLocale, useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";
import { v4 as uuid } from "uuid";

import {
  Button,
  Center,
  ColorInput,
  Grid,
  Group,
  Loader,
  Modal,
  rem,
  Stack,
  Stepper as StepperMantine,
  Text,
  TextInput,
  Title,
  useMantineTheme,
} from "@mantine/core";
import { YearPickerInput } from "@mantine/dates";
import { FileWithPath, MIME_TYPES } from "@mantine/dropzone";
import { useForm } from "@mantine/form";
import { useDisclosure, useMediaQuery } from "@mantine/hooks";
import {
  IconCircleCheck,
  IconFileTypeCsv,
  IconFolder,
  IconPhoto,
} from "@tabler/icons-react";

import Dropzone from "../Dropzone";
import Fancybox from "../Fancybox";
import SummaryTable from "../SummaryTable";
import classes from "./Stepper.module.css";

type ClazzData = {
  schoolYear: Date | null;
  clazzName: string;
  folderColor: string;
  students: Array<string>;
  photos: Array<File>;
  studentsWithPhotos: Array<{
    name: string;
    photo: FileWithPath;
    isPhotoValid: boolean;
    preview: React.ReactElement;
  }>;
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
  clazzesInSelectedSchoolYear: string[];
  arePhotosValidating: boolean;
  handlePickYearChange: (date: Date | null) => void;
  handleClazzNameChange: (n: string) => void;
  handleFolderColorChange: (color: string) => void;
  handleCSVUpload: (files: File) => void;
  handlePhotosUpload: (files: FileWithPath[]) => void;
  handleDeleteStudent: (index: number) => void;
  handleClazzDataSubmission: () => void;
};

type StepperProps = {
  stateAndHandlers: StateAndHandlers;
};

const Stepper: React.FC<StepperProps> = ({ stateAndHandlers }) => {
  const locale = useLocale();
  const t = useTranslations("Stepper");
  const theme = useMantineTheme();
  const isMobile = useMediaQuery("(max-width: 52em)");
  const mimeTypesCSV = [MIME_TYPES.csv];
  const mimeTypesPhotos = [MIME_TYPES.jpeg];

  const nextStepButtonRef: React.RefObject<HTMLButtonElement> = useRef(null);

  const [modalType, setModalType] = useState<ModalType | null>(null);
  const [opened, { open, close }] = useDisclosure(false);

  const {
    active,
    setActive,
    nextStep,
    prevStep,
    clazzData,
    clazzesInSelectedSchoolYear,
    arePhotosValidating,
    handlePickYearChange,
    handleClazzNameChange,
    handleFolderColorChange,
    handleCSVUpload,
    handlePhotosUpload,
    handleDeleteStudent,
    handleClazzDataSubmission,
  } = stateAndHandlers;

  const form = useForm({
    initialValues: {
      schoolYear: clazzData.schoolYear,
      clazzName: clazzData.clazzName,
    },
    validate: {
      schoolYear: (value) =>
        value && value.getFullYear() <= new Date().getFullYear()
          ? null
          : t("form.schoolYear.errorMessage"),
      clazzName: (value) =>
        value.trim() ? null : t("form.clazzName.errorMessage"),
    },
    validateInputOnChange: true,
  });

  useEffect(() => {
    if (active === 0) {
      const isFormValid: boolean = clazzData.schoolYear
        ? clazzData.schoolYear.getFullYear() <= new Date().getFullYear()
          ? true
          : false
        : false;
      if (nextStepButtonRef.current) {
        nextStepButtonRef.current.disabled = !isFormValid;
      }
    } else if (active === 1) {
      const isFormValid: boolean =
        clazzData.clazzName.trim() !== "" && clazzData.folderColor !== "";
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
    if (
      clazzData.students.length !== 0 &&
      clazzData.photos.length !== 0 &&
      clazzData.students.length === clazzData.photos.length
    ) {
      const hasInvalidPhoto = clazzData.studentsWithPhotos.some(
        (element) => !element.isPhotoValid
      );
      if (hasInvalidPhoto) {
        setModalType(ModalType.Error);
      } else {
        setModalType(ModalType.ConfirmUpload);
      }
      open();
    } else {
      setModalType(ModalType.Error);
      open();
    }
  };

  return (
    <>
      <StepperMantine
        active={active}
        onStepClick={setActive}
        allowNextStepsSelect={false}
        completedIcon={
          <IconCircleCheck style={{ width: rem(18), height: rem(18) }} />
        }
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
            label={t("firstStep.input.label")}
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
            label={t("secondStep.input.label")}
            placeholder={t("secondStep.input.placeholder")}
            value={clazzData.clazzName}
            onChange={(e) => {
              handleClazzNameChange(e.target.value);
              form.setFieldValue("clazzName", e.target.value);
            }}
            error={form.errors.clazzName}
            required
          />
          {!clazzesInSelectedSchoolYear.includes(clazzData.clazzName) && (
            <ColorInput
              label={t("secondStep.colorInput.label")}
              format="hex"
              swatches={[
                "#fcbc19",
                "#4154fa",
                "#429fe3",
                "#e34242",
                "#3cab68",
                "#e3a342",
                "#9c42e3",
                "#436a68",
              ]}
              swatchesPerRow={8}
              defaultValue={clazzData.folderColor}
              onChange={(color) => handleFolderColorChange(color)}
              disallowInput
              required
            />
          )}
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
            idle={t("thirdStep.dropzone.idle")}
            typesString={[".csv"]}
            handleCSVUpload={handleCSVUpload}
          />
          {clazzData.students.length > 0 && (
            <Stack mt={rem(48)}>
              {clazzData.students.map((student) => {
                return (
                  <Center>
                    <Text>{student}</Text>
                  </Center>
                );
              })}
            </Stack>
          )}
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
            idle={t("fourthStep.dropzone.idle")}
            typesString={[".jpeg"]}
            handlePhotosUpload={handlePhotosUpload}
          />
          {arePhotosValidating === true ? (
            <Center>
              <Loader color={theme.colors.pslib[6]} type="dots" size="md" />
            </Center>
          ) : (
            clazzData.photos.length > 0 && (
              <Fancybox
                options={{
                  Carousel: {
                    infinite: false,
                  },
                }}
              >
                <Grid mt={rem(48)}>
                  {clazzData.studentsWithPhotos.map((s) => (
                    <Grid.Col
                      span={{ base: 6, xs: 3, sm: 2.4, md: 2, lg: 1.5 }}
                      key={uuid()}
                    >
                      {s.preview}
                    </Grid.Col>
                  ))}
                </Grid>
              </Fancybox>
            )
          )}
        </StepperMantine.Step>
        <StepperMantine.Completed>
          <Title order={1} ta="center">
            {t("completed.title")}
          </Title>
          <Text
            ta="center"
            mb="xl"
          >{`${clazzData.schoolYear?.getFullYear()} – ${
            clazzData.clazzName
          }`}</Text>
          <SummaryTable
            studentsWithPhotos={clazzData.studentsWithPhotos}
            handleDeleteStudent={handleDeleteStudent}
          />
        </StepperMantine.Completed>
      </StepperMantine>

      <Group justify="center" mt="xl">
        <Button variant="default" onClick={prevStep}>
          {t("navigation.back")}
        </Button>
        {active === 4 ? (
          <Button onClick={openModal}>{t("navigation.submit")}</Button>
        ) : (
          <Button ref={nextStepButtonRef} onClick={nextStep}>
            {t("navigation.next")}
          </Button>
        )}
      </Group>

      <Modal
        opened={opened}
        onClose={close}
        title={
          modalType === ModalType.ConfirmUpload
            ? t("modal.valid.title")
            : t("modal.error.title")
        }
        centered
        radius="md"
        zIndex={1000}
      >
        {modalType === ModalType.ConfirmUpload ? (
          <>
            {t("modal.valid.text")}
            <Group justify="center" mt="xl">
              <Button variant="default" onClick={close}>
                {t("modal.valid.leftButton")}
              </Button>
              <Button onClick={handleClazzDataSubmission}>{t("modal.valid.rightButton")}</Button>
            </Group>
          </>
        ) : (
          <>
            {t("modal.error.text")}
            <Group justify="center" mt="xl">
              <Button color="red" onClick={close}>
                {t("modal.error.tryAgainButton")}
              </Button>
            </Group>
          </>
        )}
      </Modal>
    </>
  );
};

export default Stepper;
