"use client";

import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";
import "@mantine/dropzone/styles.css";
import "@mantine/notifications/styles.css";
import "./globals.css";

import axios from "axios";
import { NextIntlClientProvider, useLocale } from "next-intl";
import React, { useEffect } from "react";

import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import ScrollToTopButton from "@/components/ScrollToTopButton";
import csTranslations from "@/messages/cs.json";
import deTranslations from "@/messages/de.json";
import enTranslations from "@/messages/en.json";
import { ColorSchemeScript, Container, MantineProvider } from "@mantine/core";
import { Notifications } from "@mantine/notifications";

import { theme } from "../../theme";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const locale = useLocale() as "cs" | "en" | "de";

  const descriptions = {
    cs: "Vítejte v naší inovativní webové aplikaci, která přináší efektivní řešení pro správu fotografií studentů. S naší aplikací můžete snadno nahrávat, spravovat a párovat fotografie studentů s jejich jmény. Využijte naše intuitivní rozhraní a vychutnejte si bezproblémovou zkušenost s naší aplikací.",
    en: "Welcome to our innovative web application that provides an effective solution for managing student photos. With our app, you can easily upload, manage and match student photos with their names. Take advantage of our intuitive interface and enjoy a seamless experience with our app.",
    de: "Willkommen bei unserer innovativen Webanwendung, die eine effektive Lösung für die Verwaltung von Schülerfotos bietet. Mit unserer App können Sie ganz einfach Schülerfotos hochladen, verwalten und mit ihren Namen abgleichen. Profitieren Sie von unserer intuitiven Benutzeroberfläche und genießen Sie eine nahtlose Erfahrung mit unserer App.",
  };

  const messages = {
    cs: csTranslations,
    en: enTranslations,
    de: deTranslations,
  };

  const timeZones = {
    cs: "Europe/Prague",
    en: "Europe/London",
    de: "Europe/Berlin",
  };

  useEffect(() => {
    axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/cs/api/scheduleClazzesCleanup`)
      .then((res) => {
        console.log(res.data.message);
      })
      .catch((err) => {
        console.error(err.data.message);
      });
  }, []);

  return (
    <html lang={locale}>
      <head>
        <ColorSchemeScript defaultColorScheme="auto" />
        <meta charSet="UTF-8" />
        <meta name="description" content={descriptions[locale]} />
        <link
          rel="shortcut icon"
          href="/pslib-logo-icon.svg"
          type="image/x-icon"
        />
      </head>
      <body>
        <NextIntlClientProvider
          locale={locale}
          messages={messages[locale]}
          timeZone={timeZones[locale]}
        >
          <MantineProvider theme={theme} defaultColorScheme="auto">
            <Navbar />
            <main>
              <Container className="container">
                {children}
                <ScrollToTopButton />
              </Container>
              <Notifications position="bottom-right" />
            </main>
            <Footer />
          </MantineProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
