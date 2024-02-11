"use client";

import Features from "@/components/Features";
import { Button, Center, rem, Image } from "@mantine/core";
import { useDocumentTitle } from "@mantine/hooks";
import { GithubIcon } from "@mantinex/dev-icons";
import Link from "next/link";
import axios from "axios";
import { useEffect } from "react";
import { useLocale } from "next-intl";

export default function AboutPage() {
  useDocumentTitle("About");
  const locale = useLocale();

  // useEffect(() => {
  //   console.log(`${process.env.NEXT_PUBLIC_API_URL}/${locale}/api/hello?name=Jiří`);
  //   axios.get(`${process.env.NEXT_PUBLIC_API_URL}/${locale}/api/hello?name=Jiří`)
  //     .then((res) => {
  //       console.log(`Response from server: ${res.data.message}`);
  //     })
  //     .catch((error) => {
  //       console.error(`Error fetching data: ${error}`);
  //     });
  // }, []);

  useEffect(() => {
    axios.get(`${process.env.NEXT_PUBLIC_API_URL}/${locale}/api/photos?year=2024&clazz=P1A&name=Mendřický_Radomír.JPG`)
      .then(res => {
        console.log(res.data);
        document.getElementById("myImage")?.setAttribute("src", res.data.image);
      })
      .catch(err => {
        console.log(err);
      });
  }, []);

  const handleCropImage = () => {
    axios.get(`${process.env.NEXT_PUBLIC_API_URL}/${locale}/api/crop`)
      .then(res => {
        console.log(res.data.message);
      })
      .catch(err => {
        console.log(err);
      });
  }
  
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

      <Center>
        <Button
          size="md"
          mt="xl"
          onClick={handleCropImage}
        >
          Crop image using Python
        </Button>
      </Center>

      <Image
        id="myImage"
        src=""
        alt="pslib-logo"
        style={{ width: "400px", height: "auto" }}
      />
    </>
  );
}
