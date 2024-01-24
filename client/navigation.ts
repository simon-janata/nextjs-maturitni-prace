import {createSharedPathnamesNavigation} from "next-intl/navigation";
 
export const locales = ["cs", "en", "de"] as const;
// export const localePrefix = "as-needed";
export const localePrefix = "always";
 
export const {Link, redirect, usePathname, useRouter} =
  createSharedPathnamesNavigation({locales, localePrefix});
