import { chromium } from 'playwright';
import { writeToDB } from './db';
import { ProductParser } from './centrsvyazi/centrsvyazi';
import { productConfig, Product } from './centrsvyazi/centrsvyazi_config';

export async function runExtractor(url: string) {
    const browser = await chromium.launch();

    const page = await browser.newPage();
    await page.goto('https://centrsvyazi.ru/catalog/phones/apple');

    const parser = new ProductParser();
    const products: Product[] = await parser.parsePage(page, productConfig);

    await writeToDB(products);

    await browser.close();
}
