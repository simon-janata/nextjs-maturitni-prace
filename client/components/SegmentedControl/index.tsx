"use client";

import { Dispatch, SetStateAction } from "react";

import {
  SegmentedControlItem,
  SegmentedControl as SegmentedControlMantine,
  useMantineTheme
} from "@mantine/core";

import classes from "./SegmentedControl.module.css";

const SegmentedControl = (props: { data: SegmentedControlItem[], value: string, onChange: Dispatch<SetStateAction<string>> }) => {
  const theme = useMantineTheme();

  return (
    <SegmentedControlMantine
      color={theme.colors.pslib[6]}
      radius="xl"
      size="md"
      data={props.data}
      classNames={classes}
      value={props.value}
      onChange={(value) => props.onChange(value)}
    />
  );
}

export default SegmentedControl;
