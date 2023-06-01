FROM node:14

RUN apt-get update && apt-get -y install \
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

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

CMD npm run build && npm run start
