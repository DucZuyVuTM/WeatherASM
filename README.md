# WeatherASM – Интерфейс (Frontend)

[![Vite](https://img.shields.io/badge/vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![React](https://img.shields.io/badge/react-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/typescript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/tailwind_css-06B6D4?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

**Пользовательский интерфейс для веб-сервиса анализа и прогнозирования погоды WeatherASM.**  
Разработан с использованием React, TypeScript и Vite, интегрируется с backend-API для отображения данных о погоде, прогнозов, предупреждений и сравнения городов.

🌐 **Развёрнутый сайт:** [https://weatherasm.vercel.app](https://weatherasm.vercel.app)

## ✨ Основные возможности

- **🔐 Аутентификация пользователей** – Регистрация, вход и обновление JWT-токенов.
- **🏠 Приборная панель** – Просмотр текущей погоды и прогноза на 7 дней для города по умолчанию.
- **📅 Детальный прогноз** – Почасовой и ежедневный прогноз (до 16 дней) с настраиваемым периодом.
- **⚠️ Погодные предупреждения** – Автоматическое отображение предупреждений об опасных явлениях (на основе порогов температуры, ветра, осадков).
- **📊 Статистический анализ** – Графики и статистика исторических данных о погоде.
- **🔄 Сравнение городов** – Сравнение текущей погоды в нескольких городах одновременно.
- **👤 Личный кабинет** – Управление профилем, смена пароля, сохранение избранных локаций.
- **📱 Адаптивный дизайн** – Интерфейс корректно работает на настольных компьютерах и мобильных устройствах.

## 🛠️ Используемые технологии

- **Фреймворк:** [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Сборка и сервер разработки:** [Vite](https://vitejs.dev/)
- **Управление состоянием:** [Redux Toolkit](https://redux-toolkit.js.org/)
- **Маршрутизация:** [React Router DOM v7](https://reactrouter.com/)
- **HTTP-клиент:** [Axios](https://axios-http.com/)
- **Графики и диаграммы:** [Recharts](https://recharts.org/)
- **Стилизация:** [Tailwind CSS](https://tailwindcss.com/)

## 🚀 Быстрый старт

### Требования

- Node.js (версия 20.x или новее)
- npm

### Установка

1. **Клонировать репозиторий**

    ```bash
    git clone https://github.com/DucZuyVuTM/WeatherASM.git
    cd WeatherASM
    ```

2. **Установить зависимости**

    ```bash
    npm install
    ```

3. **Настроить переменные окружения**

    Создайте файл .env в корне проекта и добавьте:

    ```bash
    VITE_API_URL=http://localhost:8000
    ```

    *Примечание: Vite требует префикс `VITE_` для всех переменных окружения.*

4. **Запустить сервер разработки**

    ```bash
    npm run dev
    ```

    Приложение будет доступно по адресу <http://localhost:5173>.

## 📦 Сборка для production

```bash
npm run build
```

## ☁️ Деплой

Проект предварительно настроен для деплоя на **Vercel**. Подключите репозиторий к Vercel и добавьте переменную окружения:

- **Имя переменной:** `VITE_API_URL`
- **Значение:** `https://weatherasm-backend.onrender.com` (или URL вашего backend-сервера)

## 🗂️ Структура каталогов

```text
src/
├── app/                 # Конфигурация хранилища (Redux) и маршрутизатора
├── features/            # Redux-слайсы по функциональности (auth, weather, alerts...)
├── pages/               # Компоненты страниц (Login, Dashboard, Profile...)
├── shared/              # Общие компоненты (API client, UI components, config)
├── widgets/             # Крупные блоки интерфейса (WeatherCard, ForecastList, Chart...)
├── App.tsx              # Главный компонент приложения
├── main.tsx             # Точка входа
└── index.css            # Глобальные стили (Tailwind)
```

## 🤝 Вклад в проект

Этот проект создан в учебных и исследовательских целях. Любые предложения и замечания приветствуются.

1. Сделайте форк проекта
2. Создайте ветку для новой функции (`git checkout -b feature/new_function`)
3. Зафиксируйте изменения (`git commit -m "Feat: add new function"`)
4. Отправьте изменения в вашу ветку (`git push origin feature/new_function`)
5. Откройте Pull Request

## 📜 Лицензия

Проект разработан в рамках курсовой работы по дисциплине «Бэкенд-разработка».

Автор: **Ву Дык Зуй**

Группа: ИКБО-10-23

Университет: РТУ МИРЭА, 2026

## 🤝 Контакты

По вопросам, связанным с проектом, можно обращаться:

Email: <duczuyvu12@gmail.com>

GitHub: [DucZuyVuTM](https://github.com/DucZuyVuTM)
