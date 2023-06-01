import TelegramBot from 'node-telegram-bot-api';
import { CronJob } from 'cron';
import { getOldestProductFromDB } from '../../parser/src/db';

const token = '6142425843:AAECyuIVclaxIrEYMvy7xfhkDNFT8-XM064';

const channelUsername = '@memspepe';

const bot = new TelegramBot(token, { polling: true });

// Функция для отправки поста в канал
function sendPostToChannel(message: string) {
    bot.sendMessage(channelUsername, message)
        .then(() => {
            console.log('Пост успешно отправлен в канал');
        })
        .catch((error) => {
            console.error('Ошибка при отправке поста в канал:', error);
        });
}

function schedulePostSending() {
    const schedule = '*/5 * * * *';
    let postMessage = {};
    getOldestProductFromDB().then(v => {
        postMessage = v;
    });
    const job = new CronJob(schedule, () => {
        sendPostToChannel(`${postMessage}`);
    });

    job.start();
}

schedulePostSending();

bot.on('message', (msg) => {
    const chatId = msg.chat.id;
    const text = msg.text;

    bot.sendMessage(chatId, 'Received your message');
});
