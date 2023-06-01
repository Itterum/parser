import TelegramBot from 'node-telegram-bot-api';
import { CronJob } from 'cron';
import { getOldestProductFromDB } from '../../parser/src/db';

const token = '';

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

async function schedulePostSending() {
    const schedule = '*/5 * * * *';
    let postMessage = {
        name: '',
        newPrice: '',
        oldPrice: '',
        currency: '',
        image: '',
    };

    try {
        const data = await getOldestProductFromDB();
        if (data) {
            postMessage.name = data.name;
            postMessage.newPrice = data.newPrice.value;
            postMessage.oldPrice = data.oldPrice.value;
            postMessage.currency = data.newPrice.currency;
            postMessage.image = data.image;
        }
    } catch (err) {
        console.error('Ошибка при получении самой старой записи из базы данных:', err);
    }

    const job = new CronJob(schedule, () => {
        sendPostToChannel(`Name: ${postMessage.name}\nNew price: ${postMessage.newPrice} ${postMessage.currency}\nOld price: ${postMessage.oldPrice} ${postMessage.currency}\nImage: ${postMessage.image}`);
    });

    job.start();
}

schedulePostSending();

bot.on('message', (msg) => {
    const chatId = msg.chat.id;
    const text = msg.text;

    bot.sendMessage(chatId, 'Received your message');
});
