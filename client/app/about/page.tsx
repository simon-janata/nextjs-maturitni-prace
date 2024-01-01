"use client";

import { useDocumentTitle } from "@mantine/hooks";
import UnderConstruction from "@/components/UnderConstruction";

export default function AboutPage() {
  useDocumentTitle("About");
  
  return (
    <UnderConstruction
      pageName="About page"
      description="There will be a section here that will display information about this web application and maybe some other information about the school and who knows what other information."
    />
  );
}
