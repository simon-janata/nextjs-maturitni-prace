import createMiddleware from "next-intl/middleware";

import { localePrefix, locales } from "./navigation";

export default createMiddleware({
  defaultLocale: "cs",
  localePrefix,
  locales,

  pathnames: {
    "/": "/",

    "/add": {
      cs: "/pridat",
      en: "/add",
      de: "/hinzufuegen",
    },

    "/schoolYears": {
      cs: "/skolni-roky",
      en: "/school-years",
      de: "/schuljahre",
    },

    "/schoolYears/[schoolYear]": {
      cs: "/skolni-roky/[schoolYear]",
      en: "/school-years/[schoolYear]",
      de: "/schuljahre/[schoolYear]",
    },

    "/schoolYears/[schoolYear]/clazzes/[clazz]": {
      cs: "/skolni-roky/[schoolYear]/tridy/[clazz]",
      en: "/school-years/[schoolYear]/classes/[clazz]",
      de: "/schuljahre/[schoolYear]/klassen/[clazz]",
    },

    "/about": {
      cs: "/o-aplikaci",
      en: "/about",
      de: "/uber",
    },
  },
});

export const config = {
  matcher: ["/", "/(cs|en|de)/:path*"],
};
