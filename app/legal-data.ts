export const legalLinks = {
  privacy: "/privacy-policy",
  consent: "/personal-data-consent",
  cookies: "/cookie-policy",
} as const;

export const siteData = {
  brand: "CVT Сервис",
  domain: "remontvariator.ru",
  siteUrl: "https://remontvariator.ru",
  contacts: {
    phoneDisplay: "+7 (950) 701-82-52",
    phoneHref: "tel:+79507018252",
    email: "info@remontvariator.ru",
    emailHref: "mailto:info@remontvariator.ru",
    serviceAddress: "г. Москва, Ступинский проезд, д. 5, стр. 6",
  },
  messengers: {
    telegram: {
      href: "https://t.me/inkom10",
      label: "Автоплюс",
      icon: "/social/telegram.png",
    },
    whatsapp: {
      href: "https://wa.me/79014037963",
      label: "АКПП центр",
      phone: "+7 (901) 403-79-63",
      icon: "/social/whatsapp.png",
    },
    max: {
      phone: "+7 (915) 643-39-67",
      icon: "/social/max.png",
    },
  },
  documentVersion: "Версия 0.1 от 26 августа 2026 года",
} as const;

export const legalOperatorData = {
  name: "ООО «ИНДРАЙВ»",
  inn: "9727122382",
  ogrn: "1257700559137",
  ogrnAssignedAt: "15.12.2025",
  legalAddress: "117461, г. Москва, вн. тер. г. муниципальный округ Зюзино, ул. Керченская, д. 28А, 65",
  personalDataEmail: siteData.contacts.email,
} as const;
