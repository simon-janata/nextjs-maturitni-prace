import createMiddleware from "next-intl/middleware";
import { locales, localePrefix } from "./navigation";
 
export default createMiddleware({
  defaultLocale: "cs",
  localePrefix,
  locales,

  pathnames: {
    "/": "/",

    "/add": {
      cs: "/pridat",
      en: "/add",
      de: "/hinzufuegen"
    },

    "/years": {
      cs: "/skolni-roky",
      en: "/school-years",
      de: "/schuljahre"
    },

    "/years/[year]": {
      cs: "/skolni-roky/[year]",
      en: "/school-years/[year]",
      de: "/schuljahre/[year]"
    },

    "/years/[year]/classes/[class]": {
      cs: "/skolni-roky/[year]/tridy/[class]",
      en: "/school-years/[year]/classes/[class]",
      de: "/schuljahre/[year]/klassen/[class]"
    },

    "/about": {
      cs: "/o-aplikaci",
      en: "/about",
      de: "/uber"
    },
  }
});

export const config = {
  matcher: ["/", "/(cs|en|de)/:path*"]
};
