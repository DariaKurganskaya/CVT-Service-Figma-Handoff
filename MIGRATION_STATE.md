# Migration state

## Текущее состояние

- Этапы 1–4А завершены. Последний подтверждённый commit этапа 4А: `0150c39dff2660e21f8723433437449a9199196c`.
- Рабочая ветка: `beget-migration`. Ветка `main` не изменяется.
- Юридические страницы существуют: `/privacy-policy`, `/personal-data-consent`, `/cookie-policy`.
- Статическая сборка включает `out/api/lead.php`. Для обработчика требуется PHP 8.2+. Обе формы отправляют JSON на него; заявки доставляются на email и при наличии приватной конфигурации дублируются в Telegram.

## Текущий переход

Проект переводится на статический экспорт Next.js в папку `out/` для последующей загрузки на виртуальный хостинг Beget.

## Следующие этапы

1. Закрыть клиентские и юридические блокеры из `PREDEPLOY_BLOCKERS.md`.
2. Выполнить `scripts/build-beget-package.sh` и проверить архив по `BEGET_DEPLOYMENT_CHECKLIST.md`.
3. Только после этого разместить содержимое `out/` в `public_html` на Beget и проверить production-доставку заявок.
4. После решения по Telegram скопировать `server/cvt-leads.example.php` в приватный каталог выше `public_html` как `private/cvt-leads.php` и добавить token бота и `chat_id`.

## Локальный запуск

```bash
npm install
npm run dev
npm run build
npm test
```

## Схема заявок

`статический frontend → /api/lead.php → info@remontvariator.ru + необязательный Telegram`.

Приватная конфигурация Telegram не хранится в репозитории и не входит в `out/`. Honeypot скрыт от пользователя, а rate limit ограничивает 5 реальных попыток за 10 минут на `REMOTE_ADDR`; временно хранится только SHA-256-хеш IP и отметки времени, без содержимого заявок. До размещения на Beget нельзя подтверждать доставку email или Telegram.
