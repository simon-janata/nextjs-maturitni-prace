"use client";

import NotFound from "@/components/NotFound";

export default function NotFoundPage() {
  return (
    <NotFound
      title="Nothing to see here"
      text="Page you are trying to open does not exist. You may have mistyped the address, or the page has been moved to another URL. If you think this is an error contact support."
      buttonAddress="/about"
      buttonText="Take me back to home page"
    />
  );
}
