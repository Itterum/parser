#!/bin/bash

# Шаг 1: Запуск docker-compose up --build
docker-compose up --build -d

# Шаг 4: Создание файла restart_container.sh
echo '#!/bin/bash' > restart_container.sh
echo 'docker restart parser_parser_1' >> restart_container.sh

# Шаг 5: Делаем restart_container.sh исполняемым
chmod +x restart_container.sh

# Шаг 6: Добавляем задачу в crontab
(crontab -l ; echo '*/5 * * * * ~/parser/restart_container.sh') | crontab -

# Сообщение об успешном выполнении всех шагов
echo "Приложение успешно запущено, настроен автоматический перезапуск контейнера по расписанию."
