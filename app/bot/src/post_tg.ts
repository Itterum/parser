import TelegramBot from 'node-telegram-bot-api';
import { CronJob } from 'cron';
import { getFromDB, deleteFromDB } from '../../parser/src/db';

const template = `
*Название*: {name}
*Цена*: {newPrice.value} {newPrice.currency}
*Цена до скидки*: {oldPrice.value} {oldPrice.currency}
[Ссылка на товар]({url})
[Ссылка на картинку]({image})
`;

const token = process.env.TOKEN;

const channelUsername = '@game_infonews';

const bot = new TelegramBot(token || '', { polling: true });

function sendPostToChannel(message: string) {
    bot.sendMessage(channelUsername, message, { parse_mode: 'MarkdownV2' })
        .then(() => {
            console.log('Пост успешно отправлен в канал');
        })
        .catch((error) => {
            console.error('Ошибка при отправке поста в канал:', error);
        });
}

async function schedulePostSending() {
    const schedule = '*/5 * * * *';

    const job = new CronJob(schedule, async () => {
        try {
            const data = await getFromDB();
            if (data) {
                await deleteFromDB(data);

                const message = template
                    .replace('{image}', data.image)
                    .replace('{url}', data.url)
                    .replace('{name}', data.name)
                    .replace('{newPrice.value}', data.newPrice.value.toString())
                    .replace('{newPrice.currency}', data.newPrice.currency)
                    .replace('{oldPrice.value}', data.oldPrice.value.toString())
                    .replace('{oldPrice.currency}', data.oldPrice.currency);

                sendPostToChannel(message);
            }
        } catch (err) {
            console.error('Ошибка при получении самой старой записи из базы данных:', err);
        }
    });

    job.start();
}

schedulePostSending();

bot.on('message', (msg) => {
    const chatId = msg.chat.id;
    const text = msg.text;

    bot.sendMessage(chatId, 'Received your message');
});
