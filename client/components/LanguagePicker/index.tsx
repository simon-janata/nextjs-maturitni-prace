"use client";

import { usePathname, useRouter } from "@/navigation";
import { useLocale } from "next-intl";
import { FormEvent, useEffect, useState, useTransition } from "react";

import CzechFlag from "@/assets/cz-circle.png";
import GermanFlag from "@/assets/de-circle.png";
import EnglishFlag from "@/assets/uk-circle.png";
import { Group, Image, Menu, UnstyledButton } from "@mantine/core";
import { IconChevronDown } from "@tabler/icons-react";
import { v4 as uuid } from "uuid";

import classes from "./LanguagePicker.module.css";

interface Selected {
  value: string;
  label: string;
  image: string;
}

const data = [
  { value: "cs", label: "Čeština", image: CzechFlag.src },
  { value: "en", label: "English", image: EnglishFlag.src },
  { value: "de", label: "Deutsch", image: GermanFlag.src },
];

const LanguagePicker = () => {
  const pathname = usePathname();
  const router = useRouter();
  const locale = useLocale();
  const [opened, setOpened] = useState(false);
  const [selected, setSelected] = useState<Selected>(data[0]);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    const index = data.findIndex((item) => item.value === locale);
    if (index !== -1) {
      setSelected(data[index]);
    }
  }, [selected]);

  const onLanguageChange = (e: FormEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const nextLocale = e.currentTarget.value;
    startTransition(() => {
      router.replace(pathname, { locale: nextLocale });
    });
  }

  const items = data.map((item) => (
    <Menu.Item
      value={item.value}
      leftSection={<Image src={item.image} width={18} height={18} />}
      onClick={(e) => {
        setSelected(item);
        onLanguageChange(e);
      }}
      key={uuid()}
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
      disabled={isPending}
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
      <Menu.Dropdown className={classes.dropdown}>
        {items}
      </Menu.Dropdown>
    </Menu>
  );
}

export default LanguagePicker;
