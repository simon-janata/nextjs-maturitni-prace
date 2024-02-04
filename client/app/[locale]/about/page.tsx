"use client";

import Features from "@/components/Features";
import { Button, Center, rem } from "@mantine/core";
import { useDocumentTitle } from "@mantine/hooks";
import { GithubIcon } from "@mantinex/dev-icons";
import Link from "next/link";

export default function AboutPage() {
  useDocumentTitle("About");
  
  return (
    <>
      <Features />
    
      <Center>
        <Button
          component={Link}
          href="https://github.com/Schimanski04/nextjs-maturitni-prace"
          target="_blank"
          size="md"
          mt="xl"
          leftSection={<GithubIcon style={{ width: rem(20), height: rem(20) }} />}
          style={{ backgroundColor: "var(--mantine-color-dark-9)", color: "#fff" }}
        >
          View Source Code
        </Button>
      </Center>
    </>
  );
}
