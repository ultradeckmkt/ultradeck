import type { Metadata } from "next";

import { defaultLocale } from "@/config/site";
import { getDictionary } from "@/dictionaries";

import { MaintenancePage } from "./[locale]/_maintenance/maintenance-page";
import "./[locale]/globals.css";

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
};

export default async function RootNotFound() {
  const dictionary = await getDictionary(defaultLocale);

  return (
    <html lang={defaultLocale}>
      <body className="min-h-full flex flex-col">
        <MaintenancePage locale={defaultLocale} dictionary={dictionary} />
      </body>
    </html>
  );
}
