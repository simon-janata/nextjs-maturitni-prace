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

    "/schoolYears": {
      cs: "/skolni-roky",
      en: "/school-years",
      de: "/schuljahre"
    },

    "/schoolYears/[schoolYear]": {
      cs: "/skolni-roky/[year]",
      en: "/school-years/[year]",
      de: "/schuljahre/[year]"
    },

    "/schoolYears/[schoolYear]/clazzes/[clazz]": {
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
