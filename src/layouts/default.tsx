import { Link } from "@nextui-org/link";
import React from "react";

import { Navbar } from "@/components/navbar";

export default function DefaultLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex h-screen flex-col">
      <Navbar />
      <main className="container mx-auto max-w-7xl flex-grow px-6 pt-16">
        {children}
      </main>
      <footer className="flex w-full items-center justify-center py-3">
        <Link
          isExternal
          className="flex items-center gap-1 text-current"
          href="https://app.openaurae.org/"
          title="OpenAurae homepage"
        >
          <span className="text-default-600">Powered by</span>
          <p className="text-primary">OpenAurae</p>
        </Link>
      </footer>
    </div>
  );
}
