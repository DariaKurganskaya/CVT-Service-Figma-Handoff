# CVT Сервис

Сайт сервиса ремонта вариаторов CVT. Проект работает на обычном Next.js и собирается в полностью статическую папку `out/`.

## Команды

```bash
npm install
npm run dev
npm run build
npm test
npm run lint
scripts/build-beget-package.sh
```

После `npm run build` готовые статические файлы находятся в `out/`. В папку также копируется `out/api/lead.php` — единый обработчик заявок для обеих форм.

## Заявки на Beget

Схема работы: статический frontend → `/api/lead.php` → письмо на `info@remontvariator.ru` и, при настройке, дубликат в Telegram. Для обработчика требуется PHP 8.2+.

1. Соберите сайт командой `npm run build` и загрузите содержимое `out/` в `public_html`.
2. PHP-файл уже находится по пути `public_html/api/lead.php` и использует обычную функцию PHP `mail()` без пароля от почтового ящика.
3. Для Telegram скопируйте `server/cvt-leads.example.php` в каталог выше `public_html`, например в `private/cvt-leads.php`, и добавьте туда токен Telegram-бота и `chat_id`. Этот приватный файл не должен попадать в Git, `public_html` или `out/`.

Без настроенного Telegram письмо продолжает работать. Результат `mail()` означает лишь принятие письма локальной почтовой системой, а не гарантированную доставку. Фактическую доставку email и Telegram нужно проверить только после размещения на Beget.

Обработчик использует honeypot и ограничение до 5 реальных попыток за 10 минут на `REMOTE_ADDR`. Во временном каталоге хранится только SHA-256-хеш IP и отметки времени: имя, телефон и текст заявки не сохраняются.

Следующий этап — предпродакшен-проверка статического сайта и подготовка пакета для загрузки.

Перед размещением на Beget закройте клиентские вопросы из `PREDEPLOY_BLOCKERS.md`, затем используйте `BEGET_DEPLOYMENT_CHECKLIST.md`. Скрипт `scripts/build-beget-package.sh` создаёт локальный архив `artifacts/remontvariator-beget.zip`; он не публикуется в Git.

В проекте нет Vinext, Cloudflare, D1, Drizzle, ChatGPT Auth и ChatGPT Sites.
