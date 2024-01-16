"use client";

import { useRef } from "react";

import { ActionIcon, rem, TextInput, useMantineTheme } from "@mantine/core";
import { IconSearch, IconX } from "@tabler/icons-react";

const SearchBar = ({ placeholder, handleSearch }: { placeholder: string, handleSearch: (query: string) => void }) => {
  const theme = useMantineTheme();
  const refInput = useRef<HTMLInputElement>(null);

  return (
    <TextInput
      ref={refInput}
      radius="xl"
      size="md"
      mt="xl"
      mb="xl"
      placeholder={placeholder}
      rightSectionWidth={42}
      leftSection={<IconSearch style={{ width: rem(18), height: rem(18) }} stroke={1.5} />}
      onChange={(e) => {
        handleSearch(e.currentTarget.value);
      }}
      rightSection={
        <ActionIcon
          size={32}
          radius="xl"
          color={theme.primaryColor}
          variant="filled"
          onClick={() => {
            if (refInput.current) {
              refInput.current.value = "";
              handleSearch(refInput.current?.value);
            }
          }}
        >
          <IconX style={{ width: rem(18), height: rem(18) }} stroke={1.5} />
        </ActionIcon>
      }
    />
  );
}

export default SearchBar;
