# Migration state

## Текущее состояние

- Этапы 1–4А завершены. Последний подтверждённый commit этапа 4А: `0150c39dff2660e21f8723433437449a9199196c`.
- Рабочая ветка: `beget-migration`. Ветка `main` не изменяется.
- Юридические страницы существуют: `/privacy-policy`, `/personal-data-consent`, `/cookie-policy`.
- Статическая сборка включает `out/api/lead.php`. Обе формы отправляют JSON на этот PHP-обработчик, который доставляет заявку на email и при наличии приватной конфигурации дублирует её в Telegram.

## Текущий переход

Проект переводится на статический экспорт Next.js в папку `out/` для последующей загрузки на виртуальный хостинг Beget.

## Следующие этапы

1. Разместить содержимое `out/` в `public_html` на Beget и проверить production-доставку заявок.
2. Настроить Telegram: скопировать `server/cvt-leads.example.php` в приватный каталог выше `public_html` как `private/cvt-leads.php` и добавить токен бота и `chat_id`.
3. Антиспам, rate limit и меры защиты обработчика.

## Локальный запуск

```bash
npm install
npm run dev
npm run build
npm test
```

## Схема заявок

`статический frontend → /api/lead.php → info@remontvariator.ru + необязательный Telegram`.

Приватная конфигурация Telegram не хранится в репозитории и не входит в `out/`. До размещения на Beget нельзя подтверждать доставку email или Telegram.
