import TelegramBot from 'node-telegram-bot-api';
import { CronJob } from 'cron';
import { getMemFromDB, deleteMemFromDB } from '../../parser/src/db';

const token = process.env.TOKEN;

const channelUsername = '@memspepe';

const bot = new TelegramBot(token || '', { polling: true });

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
    const schedule = '*/45 * * * *';
    let postMessage = {
        image: '',
    };

    const job = new CronJob(schedule, async () => {
        try {
            const data = await getMemFromDB();
            if (data) {
                postMessage.image = data.image;
                await deleteMemFromDB(data);
                sendPostToChannel(postMessage.image);
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
