"use client";

import { Dispatch, SetStateAction } from "react";
import { SegmentedControl as SegmentedControlMantine, SegmentedControlItem } from "@mantine/core";
import classes from "./SegmentedControl.module.css";

const SegmentedControl = (props: { data: SegmentedControlItem[], value: string, onChange: Dispatch<SetStateAction<string>> }) => {
  return (
    <SegmentedControlMantine
      color="blue"
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
