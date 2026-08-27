import { contact, locales, type Locale } from "@/config/site";
import type { Dictionary } from "@/dictionaries";

const localeLabels: Record<Locale, string> = {
  es: "ES",
  en: "EN",
};

export function MaintenancePage({
  locale,
  dictionary,
}: {
  locale: Locale;
  dictionary: Dictionary;
}) {
  const t = dictionary.maintenance;

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-maintenance-bg px-6 py-16 text-maintenance-fg sm:px-10">
      <div className="flex w-full max-w-md flex-col items-center gap-10 sm:max-w-lg">
        <nav
          aria-label="Idioma / Language"
          className="flex gap-4 self-end text-sm tracking-wide"
        >
          {locales.map((loc) => (
            <a
              key={loc}
              href={`/${loc}`}
              aria-current={loc === locale ? "page" : undefined}
              className={
                loc === locale
                  ? "text-maintenance-fg underline underline-offset-4"
                  : "text-maintenance-muted transition-colors hover:text-maintenance-fg"
              }
            >
              {localeLabels[loc]}
            </a>
          ))}
        </nav>

        <div className="flex flex-col items-center gap-4 text-center">
          <p className="text-xs uppercase tracking-[0.3em] text-maintenance-muted">
            {t.eyebrow}
          </p>
          <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
            {t.title}
          </h1>
          <p className="text-base text-maintenance-muted sm:text-lg">
            {t.tagline}
          </p>
        </div>

        <p className="max-w-sm text-center text-sm leading-relaxed text-maintenance-muted sm:text-base">
          {t.notice}
        </p>

        <div className="flex w-full flex-col gap-6 border-t border-maintenance-border pt-8">
          <p className="text-center text-xs uppercase tracking-[0.3em] text-maintenance-muted">
            {t.contactLabel}
          </p>

          <dl className="flex flex-col gap-4 text-sm sm:text-base">
            <div className="flex flex-col gap-1">
              <dt className="text-maintenance-muted">{t.phoneLabel}</dt>
              <dd className="flex flex-col gap-1">
                {contact.phones.map((phone) => (
                  <a
                    key={phone}
                    href={`tel:${phone.replace(/[^+\d]/g, "")}`}
                    className="text-maintenance-fg transition-colors hover:text-maintenance-muted"
                  >
                    {phone}
                  </a>
                ))}
              </dd>
            </div>

            <div className="flex flex-col gap-1">
              <dt className="text-maintenance-muted">{t.emailLabel}</dt>
              <dd>
                <a
                  href={`mailto:${contact.email}`}
                  className="text-maintenance-fg transition-colors hover:text-maintenance-muted"
                >
                  {contact.email}
                </a>
              </dd>
            </div>

            <div className="flex flex-col gap-1">
              <dt className="text-maintenance-muted">{t.addressLabel}</dt>
              <dd className="text-maintenance-fg">
                {contact.address.street}, {contact.address.neighborhood}
                <br />
                {contact.address.postalCode} {contact.address.city},{" "}
                {contact.address.state}, {contact.address.country}
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
}
