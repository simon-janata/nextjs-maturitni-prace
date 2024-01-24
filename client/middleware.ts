import createMiddleware from "next-intl/middleware";
import { locales, localePrefix } from "./navigation";
 
export default createMiddleware({
  defaultLocale: "cs",
  localePrefix,
  locales
});
 
export const config = {
  matcher: ["/", "/(cs|en|de)/:path*"]
};
