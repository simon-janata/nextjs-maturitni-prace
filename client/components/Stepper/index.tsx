"use client";

import Link from "next/link";
import { useState } from "react";

import {
  Button, ColorInput, Group,
  SimpleGrid,
  List,
  Grid,
  Image,
  Box,
  Divider,
  Stepper as StepperMantine,
  TextInput, Title,
  rem
} from "@mantine/core";
import { YearPickerInput } from "@mantine/dates";
import { MIME_TYPES, FileWithPath } from "@mantine/dropzone";
import { useForm } from "@mantine/form";
import { useMediaQuery } from "@mantine/hooks";
import { IconCircleCheck, IconFileSpreadsheet, IconFolder, IconPhoto, IconCalendar, IconBackpack } from "@tabler/icons-react";

import Fancybox from "../Fancybox";
import Dropzone from "../Dropzone";
import classes from "./Stepper.module.css";

interface StateAndHandlers {
  active: number;
  setActive: React.Dispatch<React.SetStateAction<number>>;
  schoolYear: Date | null;
  setSchoolYear: React.Dispatch<React.SetStateAction<Date | null>>;
  className: string;
  setClassName: React.Dispatch<React.SetStateAction<string>>;
  students: string[];
  setStudents: React.Dispatch<React.SetStateAction<string[]>>;
  classesInYear: string[];
  classExists: boolean;
  previews: React.ReactNode[];
  nextStep: () => void;
  prevStep: () => void;
  handlePickYearChange: (date: Date | null) => void;
  handleClassNameChange: (n: string) => void;
  handleCSVUpload: (files: File) => void;
  handlePhotosUpload: (files: FileWithPath[]) => void;
}

interface StepperProps {
  stateAndHandlers: StateAndHandlers;
}

const Stepper: React.FC<StepperProps> = ({ stateAndHandlers }) => {
  const isMobile = useMediaQuery("(max-width: 50em)");
  const mimeTypesCSV = [MIME_TYPES.csv];
  const mimeTypesPhotos = [MIME_TYPES.png, MIME_TYPES.jpeg, MIME_TYPES.webp]
  // const [files, setFiles] = useState<FileWithPath[]>([]);

  // const previews = files.map((file, index) => {
  //   const imageUrl = URL.createObjectURL(file);
  //   return <Image key={index} src={imageUrl} onLoad={() => URL.revokeObjectURL(imageUrl)} />;
  // });

  // console.log(stateAndHandlers.classesInYear);

  // const formSchoolYear = useForm({
  //   initialValues: {
  //     schoolYear: null,
  //   },
    
  //   validate: {
  //     schoolYear: () => ((stateAndHandlers.schoolYear === null) ? "Invalid school year" : null),
  //   },
  // });

  const formClassName = useForm({
    initialValues: {
      className: "",
    },

    validate: {
      className: () => ((stateAndHandlers.classesInYear.includes(stateAndHandlers.className)) ? "This class already exists" : null),
    },
  });

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
          label="First step"
          description="Select a school year"
        >
          {/* <form onSubmit={formSchoolYear.onSubmit((values) => {console.log(values)})}> */}
            <YearPickerInput
              label="Pick year"
              // {...formSchoolYear.getInputProps("schoolYear")}
              value={stateAndHandlers.schoolYear}
              onChange={(e) => stateAndHandlers.handlePickYearChange(e)}
              required
            />
            {/* <Button type="submit"><IconArrowRight/></Button> */}
          {/* </form> */}
        </StepperMantine.Step>

        <StepperMantine.Step
          icon={<IconFolder style={{ width: rem(18), height: rem(18) }} />}
          label="Second step"
          description="Select a class"
        >
          <form onSubmit={formClassName.onSubmit((values) => console.log(values.className))}>
            <TextInput
              mb={rem(16)}
              label="Enter class name"
              placeholder="Enter class name"
              {...formClassName.getInputProps("className")}
              onChange={(e) => stateAndHandlers.handleClassNameChange(e.target.value)}
              value={stateAndHandlers.className}
              required
            />
            <ColorInput
              label="Pick folder colour"
              swatchesPerRow={8}
              format="hex"
              swatches={["#fcbc19", "#4154fa", "#429fe3", "#e34242", "#3cab68", "#e3a342", "#9c42e3", "#436a68"]}
              defaultValue="#fcbc19"
              disallowInput
              required
            />
            {/* <Button type="submit"><IconArrowRight/></Button> */}
          </form>
        </StepperMantine.Step>

        <StepperMantine.Step
          icon={<IconFileSpreadsheet style={{ width: rem(18), height: rem(18) }} />}
          label="Third step"
          description="Upload an CSV file"
        >
          <Dropzone
            acceptedMimeTypes={mimeTypesCSV}
            maxSize={30}
            multiple={false}
            idle="Upload CSV file of students"
            typesString={[".csv"]}
            handleCSVUpload={stateAndHandlers.handleCSVUpload}
          />
        </StepperMantine.Step>

        <StepperMantine.Step
          icon={<IconPhoto style={{ width: rem(18), height: rem(18) }} />}
          label="Fourth step"
          description="Upload photos"
        >
          <Dropzone
            acceptedMimeTypes={mimeTypesPhotos}
            maxSize={30}
            multiple={true}
            idle="Upload photos of students"
            typesString={[".png", ".jpeg", ".webp"]}
            handlePhotosUpload={stateAndHandlers.handlePhotosUpload}
          />
        </StepperMantine.Step>

        <StepperMantine.Completed>
          <Title ta="center">Summary</Title>
          <Divider my="md" />
          <Grid>
            <Grid.Col span={{ xs: 12, sm: 6, md: 6 }}>
              <Box className={classes.summaryBox}>
                <IconCalendar style={{ width: rem(18), height: rem(18) }} />
                <Title order={3}>{stateAndHandlers.schoolYear?.getFullYear()}</Title>
              </Box>
            </Grid.Col>
            <Grid.Col span={{ xs: 12, sm: 6, md: 6 }}>
              <Box className={classes.summaryBox} >
                <IconBackpack style={{ width: rem(18), height: rem(18) }} />
                <Title order={3}>{stateAndHandlers.className}</Title>
              </Box>
            </Grid.Col>
          </Grid>
          <List>
            <List.Item>{stateAndHandlers.schoolYear?.getFullYear()}</List.Item>
            <List.Item>{stateAndHandlers.className}</List.Item>
            {
              stateAndHandlers.students.map((student, i) => (
                <List.Item>{`${student} [${i}]`}</List.Item>
              ))
            }
          </List>
          <SimpleGrid cols={{ base: 1, sm: 12 }} mt={stateAndHandlers.previews.length > 0 ? "xl" : 0}>
            {stateAndHandlers.previews}
          </SimpleGrid>
        </StepperMantine.Completed>
      </StepperMantine>

      <Group justify="center" mt={rem(64)}>
        {/* <Button variant="default" onClick={stateAndHandlers.prevStep}>Back</Button> */}
        {/* {
          (() => {
            switch (stateAndHandlers.active) {
              case 0:
                return <Button disabled={stateAndHandlers.schoolYear === null} onClick={stateAndHandlers.nextStep}>Next step</Button>;
              case 1:
                return <Button disabled={stateAndHandlers.className === "" || stateAndHandlers.classExists === true} onClick={stateAndHandlers.nextStep}>Next step</Button>;
              case 2:
                return <Button disabled={stateAndHandlers.students.length === 0} onClick={stateAndHandlers.nextStep}>Next step</Button>;
              case 3:
                return <Button component={Link} href="/">Submit</Button>;
              default:
                return null;
            }
          })()
        } */}
        <Button variant="default" onClick={stateAndHandlers.prevStep}>Back</Button>
        {
          stateAndHandlers.active === 4 ? (
            <Button component={Link} href="/">Submit</Button>
          ) : (
            <Button onClick={stateAndHandlers.nextStep}>Next step</Button>
          )
        }
      </Group>
    </>
  );
}

export default Stepper;
