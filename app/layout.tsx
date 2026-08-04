import type { Metadata } from "next";
import { headers } from "next/headers";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host =
    requestHeaders.get("x-forwarded-host") ??
    requestHeaders.get("host") ??
    "localhost:3000";
  const protocol = requestHeaders.get("x-forwarded-proto") ?? "http";
  const origin = `${protocol}://${host}`;

  return {
    title: {
      default: "CVT Сервис — ремонт вариаторов в Москве",
      template: "%s | CVT Сервис",
    },
    description:
      "Специализированный ремонт вариаторов в Москве. Диагностика за 30 минут, ремонт за 1–3 дня и гарантия до 24 месяцев.",
    icons: {
      icon: "/favicon.svg",
      shortcut: "/favicon.svg",
    },
    openGraph: {
      title: "CVT Сервис — ремонт вариатора за 1–3 дня",
      description:
        "Диагностика за 30 минут, ремонт вариаторов любой сложности и гарантия до 24 месяцев.",
      type: "website",
      locale: "ru_RU",
      images: [
        {
          url: `${origin}/og.png`,
          width: 1733,
          height: 907,
          alt: "CVT Сервис — ремонт вариаторов в Москве",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: "CVT Сервис — ремонт вариаторов",
      description: "Вернём коробке жизнь за 1–3 дня.",
      images: [`${origin}/og.png`],
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body>{children}</body>
    </html>
  );
}
