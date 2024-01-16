"use client";

import Link from "next/link";

import {
  Box, Burger, Button, Center, Collapse, Divider, Drawer, Group, HoverCard, Image, rem,
  ScrollArea, SimpleGrid, Text, ThemeIcon, UnstyledButton, useMantineTheme
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import {
  IconBackpack,
  IconCalendar,
  IconChevronDown,
  IconUsers
} from "@tabler/icons-react";

import ColorSchemeToggle from "../ColorSchemeToggle";
import LanguagePicker from "../LanguagePicker";
import NavbarSearch from "../NavbarSearch";
import classes from "./Navbar.module.css";

const mockdata = [
  {
    icon: IconCalendar,
    link: "/years",
    title: "School Years",
    description: "Navigate through the high school academic timeline, view all academic years and their associated classes.",
  },
  {
    icon: IconBackpack,
    link: "/classes",
    title: "Classes",
    description: "Browse through all the classes, view students, and access class-specific resources.",
  },
  {
    icon: IconUsers,
    link: "/students",
    title: "Students",
    description: "Explore the student directory, view profiles, and find information about them.",
  },
];

const Navbar = ({ refNavbar }: { refNavbar: React.RefObject<HTMLElement> }) => {
  const [drawerOpened, { toggle: toggleDrawer, close: closeDrawer }] = useDisclosure(false);
  const [linksOpened, { toggle: toggleLinks }] = useDisclosure(false);
  const theme = useMantineTheme();

  const links = mockdata.map((item) => (
    <UnstyledButton component={Link} href={`${item.link}`} className={classes.subLink} key={item.title}>
      <Group wrap="nowrap" align="flex-start">
        <ThemeIcon size={34} variant="default" radius="md">
          <item.icon
            style={{ width: rem(22), height: rem(22) }}
            color={theme.colors.pslib[6]}
          />
        </ThemeIcon>
        <div>
          <Text size="sm" fw={500}>
            {item.title}
          </Text>
          <Text size="xs" c="dimmed">
            {item.description}
          </Text>
        </div>
      </Group>
    </UnstyledButton>
  ));

  return (
    <Box>
      <header ref={refNavbar} className={classes.header}>
        <Group justify="space-between" h="100%">
          <Link href="/" className={classes.linkLogo}>
            <Image src="/pslib-logo-dark.svg" className={classes.imgLogo} darkHidden />
            <Image src="/pslib-logo-light.svg" className={classes.imgLogo} lightHidden />
          </Link>

          <Group h="100%" gap={0} visibleFrom="sm">
            <Link href="/" className={classes.link}>
              Home
            </Link>
            <Link href="/add" className={classes.link}>
              Add
            </Link>
            <HoverCard
              width={600}
              position="bottom"
              radius="md"
              shadow="md"
              withinPortal
            >
              <HoverCard.Target>
                <Link href="/years" className={classes.link}>
                  <Center inline>
                    <Box component="span" mr={5}>
                      Explore
                    </Box>
                    <IconChevronDown
                      style={{ width: rem(16), height: rem(16) }}
                      color={theme.colors.pslib[6]}
                    />
                  </Center>
                </Link>
              </HoverCard.Target>

              <HoverCard.Dropdown style={{ overflow: "hidden" }}>
                <SimpleGrid cols={2} spacing={0}>
                  {links}
                </SimpleGrid>

                <div className={classes.dropdownFooter}>
                  <Group justify="space-between">
                    <div>
                      <Text fw={500} fz="sm">
                        Explore Data
                      </Text>
                      <Text size="xs" c="dimmed">
                        Browse through academic years, classes, and student profiles.
                      </Text>
                    </div>
                    <Button variant="default">Start Exploring</Button>
                  </Group>
                </div>
              </HoverCard.Dropdown>
            </HoverCard>
            
            <Link href="/about" className={classes.link}>
              About
            </Link>
          </Group>

          <Group visibleFrom="sm" gap="sm">
            <NavbarSearch />
            <LanguagePicker />
            <ColorSchemeToggle />
          </Group>

          <Burger
            opened={drawerOpened}
            onClick={toggleDrawer}
            hiddenFrom="sm"
          />
        </Group>
      </header>

      <Drawer
        opened={drawerOpened}
        onClose={closeDrawer}
        size="100%"
        padding="md"
        title="Navigation"
        hiddenFrom="sm"
        zIndex={10000}
      >
        <ScrollArea h={`calc(100vh - ${rem(80)})`} mx="-md">
          <Divider my="sm" />

          <Link href="/" className={classes.link} onClick={closeDrawer}>
            Home
          </Link>
          <UnstyledButton className={classes.link} onClick={toggleLinks}>
            <Center inline>
              <Box component="span" mr={5}>
                Features
              </Box>
              <IconChevronDown
                style={{ width: rem(16), height: rem(16) }}
                color={theme.colors.pslib[6]}
              />
            </Center>
          </UnstyledButton>
          <Collapse in={linksOpened}>{links}</Collapse>
          <Link href="/add" className={classes.link} onClick={closeDrawer}>
            Add
          </Link>
          <Link href="/about" className={classes.link} onClick={closeDrawer}>
            About
          </Link>

          <Divider my="sm" />

          <Group justify="center" pb="xl" px="md">
            <LanguagePicker />
            <ColorSchemeToggle />
          </Group>
        </ScrollArea>
      </Drawer>
    </Box>
  );
}

export default Navbar;
