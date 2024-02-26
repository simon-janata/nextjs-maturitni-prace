"use client";

import Link from "next/link";

import { ActionIcon, Container, Group, Image, rem } from "@mantine/core";
import { IconBrandFacebook, IconBrandInstagram, IconBrandYoutube } from "@tabler/icons-react";
import { useLocale } from "next-intl";

import classes from "./Footer.module.css";

const Footer = () => {
  const locale = useLocale();

  return (
    <footer className={classes.footer}>
      <Container className={classes.inner}>
        <Link href={`/${locale}`} className={classes.linkLogo}>
          <Image src="/pslib-logo-dark.svg" className={classes.imgLogo} darkHidden />
          <Image src="/pslib-logo-light.svg" className={classes.imgLogo} lightHidden />
        </Link>

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
