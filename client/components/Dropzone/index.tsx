import { useRef } from "react";
import { Center, Text, Group, Button, rem, useMantineTheme } from "@mantine/core";
import { Dropzone as DropzoneMantine } from "@mantine/dropzone";
import { IconCloudUpload, IconX, IconDownload } from "@tabler/icons-react";
import classes from "./Dropzone.module.css";

const Dropzone = (props: { acceptedMimeTypes: string[], maxSize: number, idle: string, typesString: string[] }) => {
  const theme = useMantineTheme();
  const openRef = useRef<() => void>(null);

  return (
    <Center className={classes.wrapper}>
      <DropzoneMantine
        openRef={openRef}
        onDrop={() => {}}
        className={classes.dropzone}
        radius="md"
        accept={props.acceptedMimeTypes}
        maxSize={props.maxSize * 1024 ** 2}
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
                props.typesString.map((type, i) => (
                  <span key={type}>
                    {i > 0 && i < props.typesString.length - 1 && ", "}
                    {i === props.typesString.length - 1 && " or "}
                    {type}
                  </span>
                ))
              }
              {" "}file less than 30mb
            </DropzoneMantine.Reject>
            <DropzoneMantine.Idle>{props.idle}</DropzoneMantine.Idle>
          </Text>
          <Text ta="center" fz="sm" mt="xs" c="dimmed">
            Drag&apos;n&apos;drop files here to upload. We can accept only{" "}
            {
              props.typesString.map((type, i) => (
                <span key={type}>
                  {i > 0 && i < props.typesString.length - 1 && ", "}
                  {i === props.typesString.length - 1 && " or "}
                  <>{type}</>
                </span>
              ))
            }
            {" "}files that
            are less than {props.maxSize}mb in size.
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
