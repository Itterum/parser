# Используем официальный образ Node.js
FROM node:14

# Устанавливаем пакет cron внутри контейнера
RUN apt-get update && apt-get -y install cron \
    libnss3 \
    libnss3-tools \
    libatk1.0-0 \
    libatk-bridge2.0-0 \
    libxkbcommon0 \
    libgbm1 \
    libasound2 \
    libdbus-1-3 \
    libdrm2 \
    libatspi2.0-0 \
    libxcomposite1 \
    libxdamage1 \
    libxfixes3 \
    libxrandr2 \
    libcairo2 \
    libpango-1.0-0 \
    libgtk-3-0 \
    libgdk-pixbuf2.0-0

# Устанавливаем рабочую директорию внутри контейнера
WORKDIR /app

# Копируем package.json и package-lock.json в рабочую директорию
COPY package*.json ./

# Устанавливаем зависимости
RUN npm install

# Копируем исходный код в рабочую директорию
COPY . .

# Запускаем cron и скрипт при старте контейнера
CMD cron && npm run dev
