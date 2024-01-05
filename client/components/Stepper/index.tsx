"use client";

import Link from "next/link";
import { IconCircleCheck, IconFolder, IconFileSpreadsheet, IconPhoto } from "@tabler/icons-react";
import { Stepper as StepperMantine, rem, Button, Group, Title, Text, Select, TextInput, ColorInput } from "@mantine/core";
import { YearPickerInput } from "@mantine/dates";
import { MIME_TYPES } from "@mantine/dropzone";
import SegmentedControl from "../SegmentedControl";
import Dropzone from "../Dropzone";
import classes from "./Stepper.module.css";

interface StateAndHandlers {
  active: number;
  setActive: React.Dispatch<React.SetStateAction<number>>;
  schoolYearSelection: string;
  setSchoolYearSelection: React.Dispatch<React.SetStateAction<string>>;
  classSelection: string;
  setClassSelection: React.Dispatch<React.SetStateAction<string>>;
  schoolYear: Date | null;
  setSchoolYear: React.Dispatch<React.SetStateAction<Date | null>>;
  className: string;
  setClassName: React.Dispatch<React.SetStateAction<string>>;
  nextStep: () => void;
  prevStep: () => void;
}

interface StepperProps {
  stateAndHandlers: StateAndHandlers;
}

const Stepper: React.FC<StepperProps> = ({ stateAndHandlers }) => {
  const { active, schoolYearSelection, classSelection, schoolYear, className } = stateAndHandlers;
  const { setActive, setSchoolYearSelection, setClassSelection, setSchoolYear, setClassName } = stateAndHandlers;
  const { nextStep, prevStep } = stateAndHandlers;

  const mimeTypesExcel = [MIME_TYPES.xlsx, MIME_TYPES.xls, MIME_TYPES.csv];
  const mimeTypesPhotos = [MIME_TYPES.png, MIME_TYPES.jpeg, MIME_TYPES.webp];

  return (
    <>
      <StepperMantine
        active={active}
        onStepClick={setActive}
        allowNextStepsSelect={false}
        completedIcon={<IconCircleCheck style={{ width: rem(18), height: rem(18) }} />}
        w="100%"
        classNames={classes}
      >
        <StepperMantine.Step
          icon={<IconFolder style={{ width: rem(18), height: rem(18) }} />}
          label="First step"
          description="Select a school year"
        >
          <SegmentedControl 
            data={[
              { value: "existing", label: "Select from an existing list" }, 
              { value: "new", label: "Create a new school year" }
            ]}
            value={schoolYearSelection}
            onChange={setSchoolYearSelection}
          />
          {
            schoolYearSelection === "existing" ? (
              <Select
                label="Pick year"
                placeholder="e.g. 2021"
                data={["2019", "2020", "2021", "2022", "2023", "2024"]}
                clearable
                required
              />
            ) : (
              <YearPickerInput
                label="Pick year"
                value={schoolYear}
                onChange={setSchoolYear}
                required
              />
            )
          }
        </StepperMantine.Step>

        <StepperMantine.Step
          icon={<IconFolder style={{ width: rem(18), height: rem(18) }} />}
          label="Second step"
          description="Select a class"
        >
          <SegmentedControl
            data={[
              { value: "existing", label: "Select from an existing list" },
              { value: "new", label: "Create a new class" }
            ]}
            value={classSelection}
            onChange={setClassSelection}
          />
          {
            classSelection === "existing" ? (
              <Select
                label="Pick class"
                placeholder="e.g. P4"
                data={["E1B", "E4C", "L4", "S2A", "S3B", "P4"]}
                clearable
                required
              />
            ) : (
              <>
                <TextInput
                  mb={rem(16)}
                  label="Pick class name"
                  placeholder="Enter class name"
                  value={className}
                  onChange={(event) => setClassName(event.currentTarget.value)}
                  required
                />
                <ColorInput
                  label="Pick folder colour"
                  format="hex"
                  swatches={["#4154fa", "#429fe3", "#e34242", "#3cab68", "#e3a342", "#9c42e3", "#436a68"]}
                  defaultValue="#f8d775"
                  disallowInput
                  required
                />
              </>
            )
          }
        </StepperMantine.Step>

        <StepperMantine.Step
          icon={<IconFileSpreadsheet style={{ width: rem(18), height: rem(18) }} />}
          label="Third step"
          description="Upload an Excel file"
        >
          <Dropzone
            acceptedMimeTypes={mimeTypesExcel}
            maxSize={30}
            multiple={false}
            idle="Upload Excel file of students"
            typesString={[".xlsx", ".xls"]}
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
          />
        </StepperMantine.Step>

        <StepperMantine.Completed>
          <Title ta="center">Summary</Title>
          <Text ta="center">Lorem ipsum dolor sit amet, consectetuer adipiscing elit. In laoreet, magna id viverra tincidunt, sem odio bibendum justo, vel imperdiet sapien wisi sed libero. Nulla accumsan, elit sit amet varius semper, nulla mauris mollis quam, tempor suscipit diam nulla vel leo. Morbi imperdiet, mauris ac auctor dictum, nisl ligula egestas nulla, et sollicitudin sem purus in lacus. Nullam rhoncus aliquam metus. Sed vel lectus. Donec odio tempus molestie, porttitor ut, iaculis quis, sem. Duis risus. Donec vitae arcu. In enim a arcu imperdiet malesuada. Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus, omnis voluptas assumenda est, omnis dolor repellendus. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Curabitur sagittis hendrerit ante.</Text>
        </StepperMantine.Completed>
      </StepperMantine>

      <Group justify="center" mt={rem(64)}>
        <Button variant="default" onClick={prevStep}>Back</Button>
        {
          active === 4 ? (
            <Button component={Link} href="/">Submit</Button>
          ) : (
            <Button onClick={nextStep}>Next step</Button>
          )
        }
      </Group>
    </>
  );
}

export default Stepper;
