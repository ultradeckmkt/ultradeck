import type { Metadata } from "next";

import { defaultLocale, isLocale } from "@/config/site";
import { getDictionary } from "@/dictionaries";

import { MaintenancePage } from "./_maintenance/maintenance-page";

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
};

export default async function NotFound({
  params,
}: {
  params?: Promise<{ locale?: string }>;
}) {
  const { locale: rawLocale } = (await params) ?? {};
  const locale =
    rawLocale && isLocale(rawLocale) ? rawLocale : defaultLocale;

  const dictionary = await getDictionary(locale);

  return <MaintenancePage locale={locale} dictionary={dictionary} />;
}
