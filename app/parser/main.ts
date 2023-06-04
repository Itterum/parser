import { runExtractor } from "./src/extractor_runner";
import { CronJob } from 'cron';

async function run() {
  try {
    await runExtractor('https://dtf.ru/kek');
  } catch (error) {
    console.error('Ошибка при выполнении функции run:', error);
  }
}

function schedulePostSending() {
  const schedule = '*/30 * * * *';

  try {
    const job = new CronJob(schedule, async () => {
      await run();
    });

    job.start();
    console.log('CronJob запущен по расписанию:', schedule);
  } catch (error) {
    console.error('Ошибка при настройке CronJob:', error);
  }
}

schedulePostSending();
