"use client";

import React from "react";
// import "./globals.css";
import "@mantine/core/styles.css";
import { MantineProvider, ColorSchemeScript, Container } from "@mantine/core";
import { theme } from "../theme";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <ColorSchemeScript />
        <link rel="shortcut icon" href="/favicon.svg" type="image/x-icon" />
        <meta name="description" content="I am using Mantine with Next.js!" />
        <title>Mantine Next.js template</title>
      </head>
      <body>
        <MantineProvider theme={theme} defaultColorScheme="auto">
          <Navbar />
          <Container>
            {children}
          </Container>
          <Footer />
        </MantineProvider>
      </body>
    </html>
  )
}
