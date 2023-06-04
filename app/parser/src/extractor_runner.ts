import { chromium } from 'playwright';
import { writeMemsToDB } from './db';
import { parsePage } from './mems';

export async function runExtractor(url: string) {
    const browser = await chromium.launch();
    
    const page = await browser.newPage();
    await page.goto(url);

    const mems = await parsePage(page);

    await writeMemsToDB(mems);

    await browser.close();
}
