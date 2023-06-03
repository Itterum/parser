import { chromium } from 'playwright';
import { writeProductsToDB } from './db';
import { parsePage } from './centrsvyazi';

export async function runExtractor(url: string) {
    const browser = await chromium.launch();
    
    const page = await browser.newPage();
    await page.goto(url);

    const products = await parsePage(page);

    await writeProductsToDB(products);

    await browser.close();
}
