"use client";

import Link from "next/link";
import { Container, Group, ActionIcon, rem } from "@mantine/core";
import { IconBrandFacebook, IconBrandYoutube, IconBrandInstagram } from "@tabler/icons-react";
import { MantineLogo } from "@mantinex/mantine-logo";
import classes from "./Footer.module.css";

const Footer = ({ refFooter }: { refFooter: React.RefObject<HTMLElement> }) => {
  return (
    <footer ref={refFooter} className={classes.footer}>
      <Container className={classes.inner}>
        <MantineLogo size={28} />
        <Group gap={0} className={classes.links} justify="flex-end" wrap="nowrap">
          <ActionIcon component={Link} href="https://www.facebook.com/pslibofficial/" rel="noopener noreferrer" target="_blank" size="lg" color="gray" variant="subtle">
            <IconBrandFacebook style={{ width: rem(20), height: rem(20) }} stroke={1.5} />
          </ActionIcon>

          <ActionIcon component={Link} href="https://www.instagram.com/pslib_official/" rel="noopener noreferrer" target="_blank" size="lg" color="gray" variant="subtle">
            <IconBrandInstagram style={{ width: rem(20), height: rem(20) }} stroke={1.5} />
          </ActionIcon>
          
          <ActionIcon component={Link} href="https://www.youtube.com/@prumkaTV" rel="noopener noreferrer" target="_blank" size="lg" color="gray" variant="subtle">
            <IconBrandYoutube style={{ width: rem(20), height: rem(20) }} stroke={1.5} />
          </ActionIcon>
        </Group>
      </Container>
    </footer>
  );
}

export default Footer;
