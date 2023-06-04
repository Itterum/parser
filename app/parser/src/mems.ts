import { Page } from 'playwright';

export interface Mem {
    image: string;
}

export async function parsePage(page: Page): Promise<Mem[]> {
    await page.waitForSelector('.feed__chunk .feed__item');

    const products = await page.$$eval('.feed__chunk .feed__item', (elements) => {
        return elements.map((element) => {
            const imageElement = element.querySelector('.andropov_image img');


            const image = `${imageElement?.getAttribute('src')}` || '';

            return {
                image,
            };
        });
    });

    return products;
}
