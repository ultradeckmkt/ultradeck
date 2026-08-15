# Ultra Deck — Sitio web

## Cliente
Ultra Deck, S.A. de C.V. Fundada en diciembre de 1990.
Suministro e instalación de cubiertas metálicas para nave industrial.
Sede: General Escobedo, Nuevo León, México.
Agencia a cargo: SCNDAL.

## Stack
- Next.js (App Router) + TypeScript
- Tailwind CSS
- Deploy en Vercel (por ahora solo preview, sin dominio propio)
- Resend para el formulario de contacto — PENDIENTE, no configurar aún

## Decisiones de arquitectura ya tomadas (no reabrir)

1. ARQUITECTURA DE MARCA: el sitio tiene dos ramas fuertes desde el
   home — Construcción y Mantenimiento. Son dos mercados con
   competidores y buyer persona distintos. No mezclar el mensaje.

2. IDIOMAS: español e inglés, ambos completos. Rutas /es y /en con
   hreflang y x-default. El español es el idioma por defecto.

3. LANDINGS POR CIUDAD: NO se construyen nunca. En su lugar existe un
   archivo de configuración con las zonas de cobertura que consumen
   los componentes. Cero rutas dinámicas por ciudad, cero URLs por
   municipio en el sitemap.

4. IDENTIDAD VISUAL: está en proceso de diseño. NO existe paleta
   definitiva. Todo el color y la tipografía se maneja con design
   tokens semánticos en variables CSS. Prohibido hardcodear colores
   en los componentes. El amarillo y gris del sitio viejo NO son la
   identidad de marca.

5. FORMULARIO DE CONTACTO: se construye la UI y el esquema de datos
   completo, pero el envío queda desconectado (stub). Resend se
   conecta al final del proyecto.

6. CANALONES Y BAJANTES PLUVIALES: se reserva la ruta dentro de la
   rama de Mantenimiento, sin contenido. Es el mayor hueco de mercado
   detectado y la estructura debe contemplarlo desde el inicio.

## En backlog (NO tocar en esta fase)
- Configuración de Resend
- Google Business Profile
- Blog y contenido editorial
- Casos de éxito desarrollados
- Migración del dominio ultradeck.com.mx

## Fase actual
Fase 1: armazón e infraestructura. Estructura base, header, footer,
sitemap y home preconstruida.
