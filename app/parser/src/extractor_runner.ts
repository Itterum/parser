import { chromium } from 'playwright';
import { writeToDB } from './db';
import { Product, ProductParser, productConfig } from './centrsvyazi';

export async function runExtractor(url: string) {
    const browser = await chromium.launch();

    const page = await browser.newPage();
    await page.goto('https://centrsvyazi.ru/catalog/phones/apple');

    // const page: Page = ...; // Получите объект Page

    const parser = new ProductParser();
    const products: Product[] = await parser.parsePage(page, productConfig);

    console.log(products);

    await writeToDB(products);

    await browser.close();
}
