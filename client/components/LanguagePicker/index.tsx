"use client";

import { useState } from "react";
import { UnstyledButton, Menu, Image, Group } from "@mantine/core";
import { IconChevronDown } from "@tabler/icons-react";
import CzechFlag from "@/assets/cz-circle.png";
import EnglishFlag from "@/assets/uk-circle.png";
import GermanFlag from "@/assets/de-circle.png";
import classes from "./LanguagePicker.module.css";

const data = [
  { value: "cs", label: "Čeština", image: CzechFlag.src },
  { value: "en-GB", label: "English", image: EnglishFlag.src },
  { value: "de", label: "Deutsch", image: GermanFlag.src },
];

const LanguagePicker = () => {
  const [opened, setOpened] = useState(false);
  const [selected, setSelected] = useState(data[0]);
  const items = data.map((item) => (
    <Menu.Item
      leftSection={<Image src={item.image} width={18} height={18} />}
      onClick={() => setSelected(item)}
      key={item.label}
    >
      {item.label}
    </Menu.Item>
  ));

  return (
    <Menu
      onOpen={() => setOpened(true)}
      onClose={() => setOpened(false)}
      radius="md"
      width="target"
      withinPortal
    >
      <Menu.Target>
        <UnstyledButton className={classes.control} data-expanded={opened || undefined}>
          <Group gap="xs">
            <Image src={selected.image} width={22} height={22} />
            <span className={classes.label}>{selected.label}</span>
          </Group>
          <IconChevronDown size="1rem" className={classes.icon} stroke={1.5} />
        </UnstyledButton>
      </Menu.Target>
      <Menu.Dropdown className={classes.dropdown}>{items}</Menu.Dropdown>
    </Menu>
  );
}

export default LanguagePicker;
