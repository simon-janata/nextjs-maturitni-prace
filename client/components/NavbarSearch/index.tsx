"use client";

import { useRouter } from "next/navigation";

import { Group, rem, UnstyledButton } from "@mantine/core";
import { Spotlight, spotlight, SpotlightActionData } from "@mantine/spotlight";
import { IconDashboard, IconFileText, IconHome, IconSearch } from "@tabler/icons-react";

import classes from "./NavbarSearch.module.css";

const NavbarSearch = () => {
  const router = useRouter();

  const actions: SpotlightActionData[] = [
    {
      id: "home",
      label: "Home",
      description: "Get to home page",
      onClick: () => router.push("/"),
      leftSection: <IconHome style={{ width: rem(24), height: rem(24) }} stroke={1.5} />,
    },
    {
      id: "dashboard",
      label: "Dashboard",
      description: "Get full information about current system status",
      onClick: () => console.log("Dashboard"),
      leftSection: <IconDashboard style={{ width: rem(24), height: rem(24) }} stroke={1.5} />,
    },
    {
      id: "documentation",
      label: "Documentation",
      description: "Visit documentation to lean more about all features",
      onClick: () => console.log("Documentation"),
      leftSection: <IconFileText style={{ width: rem(24), height: rem(24) }} stroke={1.5} />,
    },
  ];

  return (
    <>
      <UnstyledButton className={classes.searchButton} onClick={spotlight.open}>
        <Group>
          <IconSearch style={{ width: rem(22), height: rem(22) }} stroke={1.5} />
        </Group>
      </UnstyledButton>
      <Spotlight
        radius="md"
        actions={actions}
        nothingFound="Nothing found..."
        highlightQuery
        searchProps={{
          leftSection: <IconSearch style={{ width: rem(20), height: rem(20) }} stroke={1.5} />,
          placeholder: "Search...",
        }}
      />
    </>
  );
}

export default NavbarSearch;
