"use client";

import { useRef } from "react";

import { Button, Center, Group, rem, Text, useMantineTheme } from "@mantine/core";
import { Dropzone as DropzoneMantine, FileWithPath, MIME_TYPES } from "@mantine/dropzone";
import { IconCloudUpload, IconDownload, IconX } from "@tabler/icons-react";

import classes from "./Dropzone.module.css";

interface DropzoneProps {
  acceptedMimeTypes: string[];
  maxSize: number;
  multiple: boolean;
  idle: string;
  typesString: string[];
  handleCSVUpload?: (file: File) => void;
  handlePhotosUpload?: (files: FileWithPath[]) => void;
}

const Dropzone: React.FC<DropzoneProps> = ({ acceptedMimeTypes, maxSize, multiple, idle, typesString, handleCSVUpload, handlePhotosUpload }) => {
  const theme = useMantineTheme();
  const openRef = useRef<() => void>(null);

  return (
    <Center className={classes.wrapper}>
      <DropzoneMantine
        openRef={openRef}
        onDrop={(e) => {
          if (acceptedMimeTypes.includes(MIME_TYPES.csv)) {
            handleCSVUpload && handleCSVUpload(e[0])
          } else {
            e.sort((a, b) => a.name.localeCompare(b.name));
            handlePhotosUpload && handlePhotosUpload(e)
          }
        }}
        className={classes.dropzone}
        radius="md"
        accept={acceptedMimeTypes}
        maxSize={maxSize * 1024 ** 2}
        multiple={multiple}
      >
        <div style={{ pointerEvents: "none" }}>
          <Group justify="center">
            <DropzoneMantine.Accept>
              <IconDownload
                style={{ width: rem(70), height: rem(70) }}
                color={theme.colors.blue[6]}
                stroke={1.5}
              />
            </DropzoneMantine.Accept>
            <DropzoneMantine.Reject>
              <IconX
                style={{ width: rem(70), height: rem(70) }}
                color={theme.colors.red[6]}
                stroke={1.5}
              />
            </DropzoneMantine.Reject>
            <DropzoneMantine.Idle>
              <IconCloudUpload className={classes.icon} style={{ width: rem(70), height: rem(70) }} stroke={1.5} />
            </DropzoneMantine.Idle>
          </Group>

          <Text ta="center" fw={700} fz="lg" mt="xl">
            <DropzoneMantine.Accept>Drop files here</DropzoneMantine.Accept>
            <DropzoneMantine.Reject>
              only{" "}
              {
                typesString.map((type, i) => (
                  <span key={type}>
                    {i > 0 && i < typesString.length - 1 && ", "}
                    {i === typesString.length - 1 && " or "}
                    {type}
                  </span>
                ))
              }
              {" "}file less than 30mb
            </DropzoneMantine.Reject>
            <DropzoneMantine.Idle>{idle}</DropzoneMantine.Idle>
          </Text>
          <Text ta="center" fz="sm" mt="xs" c="dimmed">
            Drag&apos;n&apos;drop files here to upload. We can accept only{" "}
            {
              typesString.map((type, i) => (
                <span key={type}>
                  {i > 0 && i < typesString.length - 1 && ", "}
                  {i === typesString.length - 1 && " or "}
                  <>{type}</>
                </span>
              ))
            }
            {" "}files that
            are less than {maxSize}mb in size.
          </Text>
        </div>
      </DropzoneMantine>

      <Button className={classes.control} size="md" radius="xl" onClick={() => openRef.current?.()}>
        Select files
      </Button>
    </Center>
  );
}

export default Dropzone;
