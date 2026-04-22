# Frontend (Vite + React + TypeScript)

## Запуск

1. Установить зависимости:

```bash
npm install
```

2. Запустить JSON Server (локальный API):

```bash
npm run api
```

3. В отдельном терминале запустить фронтенд:

```bash
npm run dev
```

Или запустить оба процесса одной командой:

```bash
npm run dev:all
```

## Переменные окружения

Скопируйте `.env.example` в `.env` при необходимости и задайте URL API:

```env
VITE_API_URL=http://localhost:3001
```

## Источник данных

Данные для `json-server` находятся в файле `db.json`.

Доступные ресурсы:

- `/news`
- `/information`
- `/regionContacts`
- `/leadershipMembers`
- `/contactIntro`
- `/supportPhoneInfo`
- `/informationMeta`

`json-server` поддерживает стандартные операции `GET`, `POST`, `PUT`, `PATCH`, `DELETE`.
