# CVT Сервис — handoff для точной пересборки в Figma

## 1. Исходный проект

- **Тип:** одностраничный сервисный сайт.
- **Фреймворк:** React 19 + Next.js 16 (App Router), сборка через Vinext 0.0.50 / Vite 8, Worker-совместимый production output.
- **Точка входа страницы:** `app/page.tsx`.
- **Глобальные стили и адаптив:** `app/globals.css`.
- **Метаданные, favicon и Open Graph:** `app/layout.tsx`.
- **Публичные assets:** `public/`.
- **Production output:** `dist/`.
- **Зафиксированная публичная production-версия:** `https://cvt-expert-moscow.vbzvzudvd.chatgpt.site/`.
- **Локальный запуск:** `npm run dev`.
- **Production-сборка:** `npm run build`.

У проекта нет каталогов `src/` и `assets/`: исходники App Router находятся в `app/`, а все web-assets — в `public/`. Это исходная структура проекта, её не нужно искусственно менять при переносе.

## 2. Базовая геометрия и типографика

- Основной desktop-контейнер `.shell`: `width: min(1200px, calc(100% - 72px))`; на ширине 1440 px фактическая ширина контейнера — **1200 px**.
- До 800 px `.shell`: `width: calc(100% - 28px)`.
- Базовый шрифт: **Montserrat**, fallback `Arial, Helvetica, sans-serif`.
- Подключённые начертания: 400, 500, 600, 700, 800, 900.
- Источник шрифта: Google Fonts через первый `@import` в `app/globals.css`.
- Не заменять текст кривыми: все заголовки, подписи, значения статистики, кнопки и тексты форм должны остаться редактируемыми Text layers в Figma.

### Цвета

| Token | Значение | Применение |
| --- | --- | --- |
| `--red` | `#ef302b` | Основной красный акцент, CTA, выделения |
| `--red-dark` | `#941a18` | Тёмный красный градиент |
| `--ink` | `#202020` | Базовый тёмный фон |
| `--ink-deep` | `#151515` | Глубокий тёмный фон |
| `--paper` | `#f5f3f0` | Светлая плашка обложки |
| `--muted` | `rgba(255,255,255,0.58)` | Вторичный белый текст |

### Радиусы и тени

- `--radius-sm: 12px`
- `--radius-md: 18px`
- `--radius-lg: 26px`
- `--shadow-soft: 0 28px 80px rgba(0,0,0,.28)`
- Дополнительные реальные значения отдельных карточек, кнопок и изображений зафиксированы в `sections-*.json` как computed styles.

## 3. Порядок секций

1. `01_first_screen` — `.hero`; включает header, hero-card, форму и статистику.
2. `02_section_navigation` — `.sectionNav`; липкая desktop-навигация.
3. `03_about` — `#about`.
4. `04_services` — `#services`.
5. `05_process` — `#process`.
6. `06_brands` — `#advantages`.
7. `07_guarantee` — `.guarantee`.
8. `08_reviews` — `#reviews`.
9. `09_contacts` — `#contacts`.
10. `10_footer` — `.footer`.

Отдельно присутствует фиксированная круглая кнопка звонка `.floatingCall` с `position: fixed` и `z-index: 30`.

## 4. Адаптив

Измеренные выгрузки находятся в отдельных файлах:

- `sections-1200.json`
- `sections-960.json`
- `sections-640.json`
- `sections-480.json`
- `sections-320.json`

Точки адаптива в исходном CSS:

- `max-width: 1120px`: шапка сужается; блок о нас становится двухколоночным с фото на всю ширину; services — 3 колонки; гарантия — одна колонка.
- `max-width: 800px`: мобильная композиция. Header становится вертикальным (`brand → phone → meta → social`); мобильное меню видимо; `.sectionNav` скрыт; hero card, форма и статистика переходят в обычный поток; карточки услуг, этапы, отзывы и контакты становятся одноколоночными.
- `max-width: 430px`: заголовки и hero text уменьшаются; grid метрик и марок — 2 колонки; высота process visual уменьшена.

JSON фиксирует для каждого элемента `display`, `position`, `order`, `gridTemplateColumns`, `gridTemplateAreas`, `flexDirection`, `objectFit`, `objectPosition`, `backgroundSize`, `backgroundPosition` и `isHidden`. Именно эти поля использовать для восстановления порядка, скрытия меню и кадрирования, а не масштабировать desktop-макет.

## 5. Изображения, SVG и иконки

### Используемые на странице

| Asset | Где используется |
| --- | --- |
| `public/hero-variator-real.jpg` | фоновое изображение `.hero` |
| `public/client-logo-clean.png` | логотип в header и footer |
| `public/about-workshop-real.jpg` | фото в `03_about` |
| `public/process-repair-real.jpg` | фото в `05_process` |
| `public/social/max.png` | MAX в header и footer |
| `public/social/telegram.png` | Telegram в header и footer |
| `public/social/whatsapp.png` | WhatsApp в header и footer |
| `public/brands/{nissan,toyota,mitsubishi,subaru,honda,audi,renault,volkswagen,jeep,kia,hyundai,volvo}.png` | сетка в `06_brands` |
| `public/favicon.svg` | favicon |
| `public/og.png` | Open Graph / preview-карта страницы |

### В архиве, но не используются текущим рендером

`autorizen-logo.png`, `client-logo-red.png`, `client-logo-white-red.png`, `cvt-hero.png`, `service-diagnostic.webp`, `service-team.webp`, `service-workshop.webp`, `file.svg`, `globe.svg`, `window.svg`, а также SVG-версии иконок `public/social/{max,telegram,whatsapp}.svg` — сохранены в ZIP как исходные материалы, но не подключены в `app/page.tsx` или CSS финальной версии.

## 6. Ссылки и интерактивные элементы

- Логотипы header/footer: `#top`.
- Телефоны и floating call: `tel:+79156442641`.
- Почта: `mailto:servise@remontvariatora1.ru`.
- MAX: `https://max.ru/`.
- Telegram: `https://t.me/inkom10`.
- WhatsApp: `https://wa.me/79156442641`.
- Desktop-меню: якоря `#about`, `#process`, `#services`, `#advantages`, `#reviews`, `#contacts`.
- Мобильное меню: нативный `<details>` / `<summary>` и те же якоря.
- CTA из hero, услуг, блока о нас и гарантии: `#diagnostic-form`.
- Карта: Яндекс Maps iframe; «Построить маршрут» открывает адрес в новой вкладке.
- Hover-поведение: social-иконки, карточки услуг, отзывы и фотографии; точные transitions остаются в CSS.
- Анимации: hero rise, scroll-driven reveal и pulse у fixed call; предусмотрен `prefers-reduced-motion: reduce`.

## 7. Формы

1. `#diagnostic-form` в обложке: поля «Имя», «Телефон», «Сообщение», submit «Записаться».
2. `.contactForm` в контактах: поля «Ваше имя», «Телефон», textarea «Сообщение», submit «Отправить заявку».

Обе формы сейчас используют `action="mailto:servise@remontvariatora1.ru"`, `method="post"`, `encType="text/plain"`. Это интерактивная исходная логика, а не серверный обработчик заявок.

## 8. Скриншоты и координаты

- Полная страница и каждая видимая секция сняты с опубликованной страницы в `screenshots/<viewport>/`.
- Для скрытой на мобильных ширинах `02_section_navigation` отдельный PNG не создаётся намеренно: секция имеет `display: none`; это явно отмечено в соответствующем JSON.
- Все координаты, размеры, высоты, стили, ресурсы и visibility получены программно через `getBoundingClientRect()` и `getComputedStyle()` на опубликованной production-странице.
