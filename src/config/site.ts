export const locales = ["es", "en"] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "es";

export const siteName = "Ultra Deck";

export const foundingYear = 1990;

export const contact = {
  phones: ["+52 81 8190 0884", "+52 81 8190 0888"],
  email: "contacto@ultradeck.com.mx",
  address: {
    street: "Priv. Juan Escutia #115",
    neighborhood: "Col. Niños Héroes",
    postalCode: "66052",
    city: "General Escobedo",
    state: "Nuevo León",
    country: "México",
  },
} as const;

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

/**
 * URL base del sitio. Se resuelve en tiempo de ejecución porque todavía no hay
 * dominio propio: en preview cambia con cada deploy de Vercel.
 * NEXT_PUBLIC_SITE_URL es el override manual para cuando se migre a
 * ultradeck.com.mx.
 */
export function getSiteUrl(): string {
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL;
  }

  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  }

  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }

  return "http://localhost:3000";
}
