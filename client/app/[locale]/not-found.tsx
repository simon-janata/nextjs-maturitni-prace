"use client";

import NotFound from "@/components/NotFound";
import { useDocumentTitle } from "@mantine/hooks";

export default function NotFoundPage() {
  useDocumentTitle("Not found");
  
  return (
    <NotFound
      title="Nothing to see here"
      text="Page you are trying to open does not exist. You may have mistyped the address, or the page has been moved to another URL. If you think this is an error contact support."
      buttonAddress="/"
      buttonText="Take me back to home page"
    />
  );
}
