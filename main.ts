import { scrapController } from "./services/scrap_controller";

async function run() {
    await scrapController('https://centrsvyazi.ru/catalog/phones/apple');

    await scrapController('https://centrsvyazi.ru/catalog/phones/samsung');
}

run();
