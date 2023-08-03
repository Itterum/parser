import { Page, chromium } from 'playwright';

export interface Mem {
    name: string;
    source: string;
}

export async function parsePage(page: Page): Promise<Mem[]> {
    await page.waitForSelector('.feed__chunk .feed__item');

    const mems = await page.$$eval('.feed__chunk .feed__item', (elements) => {
        return elements.map((element) => {
            const nameElement = element.querySelector('.content-title');
            const imageElement = element.querySelector('.andropov_image img') || element.querySelector('.andropov_image__inner img');
            const videoElement = element.querySelector('.andropov_video__container video');

            const name = nameElement?.textContent?.trim() || '';

            let source = '';
            if (imageElement) {
                source = imageElement.getAttribute('src') || '';
            } else if (videoElement) {
                source = videoElement.getAttribute('src') || '';
            }

            return {
                name,
                source
            };
        });
    });

    return mems;
}

async function runExtractor() {
    const browser = await chromium.launch();
    const page = await browser.newPage();
    await page.goto('https://dtf.ru/games/entries/popular');

    const mems = await parsePage(page);
    console.log(mems);

    await browser.close();
}

runExtractor();
