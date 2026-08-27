import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://remontvariator.ru"),
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
        url: "/og.png",
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
    images: ["/og.png"],
  },
};

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
