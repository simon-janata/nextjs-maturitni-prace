"use client";

import React, { useEffect, useRef } from "react";
import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";
import "@mantine/dropzone/styles.css";
import "./globals.css";
import { MantineProvider, ColorSchemeScript, Container } from "@mantine/core";
import { theme } from "../theme";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const refNavbar: React.RefObject<HTMLElement> = useRef(null);
  const refFooter: React.RefObject<HTMLElement> = useRef(null);
  const refMain: React.RefObject<HTMLElement> = useRef(null);

  useEffect(() => {
    const handleResize = () => {
      const windowHeight = window.innerHeight;
      const navbarHeight = refNavbar.current ? refNavbar.current.offsetHeight : 0;
      const footerHeight = refFooter.current ? refFooter.current.offsetHeight : 0;

      const mainHeight = windowHeight - navbarHeight - footerHeight;

      if (refMain.current) {
        refMain.current.style.minHeight = `${mainHeight}px`;
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <html lang="en">
      <head>
        <ColorSchemeScript defaultColorScheme="auto" />
        <link rel="shortcut icon" href="/pslib-logo-icon.svg" type="image/x-icon" />
        <meta name="description" content="Next.js app" />
      </head>
      <body>
        <MantineProvider theme={theme} defaultColorScheme="auto">
          <Navbar refNavbar={refNavbar} />
          <main ref={refMain}>
            <Container>
              {children}
            </Container>
          </main>
          <Footer refFooter={refFooter} />
        </MantineProvider>
      </body>
    </html>
  );
}
