"use client";

import { useState } from "react";
import { IconCircleCheck, IconFolder, IconFileSpreadsheet, IconPhoto } from "@tabler/icons-react";
import { Stepper, rem, Image, Button, Group } from "@mantine/core";

export default function AddPage() {
  const [active, setActive] = useState(0);
  const nextStep = () => setActive((current) => (current < 3 ? current + 1 : current));
  const prevStep = () => setActive((current) => (current > 0 ? current - 1 : current));

  return (
    <>
      <Stepper
        active={active}
        onStepClick={setActive}
        allowNextStepsSelect={false}
        completedIcon={<IconCircleCheck style={{ width: rem(18), height: rem(18) }} />}
      >
        <Stepper.Step
          icon={<IconFolder style={{ width: rem(18), height: rem(18) }} />}
          label="First step"
          description="Select or create a folder"
        >
          <Image
            radius="md"
            h="auto"
            w="100%"
            fit="contain"
            src="https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-7.png"
            fallbackSrc="https://placehold.co/1920x1080?text=Not+found"
          />
        </Stepper.Step>
        <Stepper.Step
          icon={<IconFileSpreadsheet style={{ width: rem(18), height: rem(18) }} />}
          label="Second step"
          description="Upload an Excel file"
        >
          <Image
            radius="md"
            h="auto"
            w="100%"
            fit="contain"
            src="https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-8.png"
            fallbackSrc="https://placehold.co/1920x1080?text=Not+found"
          />
        </Stepper.Step>
        <Stepper.Step
          icon={<IconPhoto style={{ width: rem(18), height: rem(18) }} />}
          label="Third step"
          description="Upload photos"
        >
          <Image
            radius="md"
            h="auto"
            w="100%"
            fit="contain"
            src="https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-10.png"
            fallbackSrc="https://placehold.co/1920x1080?text=Not+found"
          />
        </Stepper.Step>
        <Stepper.Completed>
          <Image
            radius="md"
            h="auto"
            w="100%"
            fit="contain"
            src="https://placehold.co/1920x1080?text=Done"
          />
        </Stepper.Completed>
      </Stepper>

      <Group justify="flex-end" mt="xl">
        <Button variant="default" onClick={prevStep}>Back</Button>
        <Button onClick={nextStep}>Next step</Button>
      </Group>
    </>
  );
}
