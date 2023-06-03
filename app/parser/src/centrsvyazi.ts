import { Page } from 'playwright';

interface Price {
    value: number;
    currency: string;
}

export interface Product {
    name: string;
    newPrice: Price;
    oldPrice: Price;
    image: string;
}

export async function parsePage(page: Page): Promise<Product[]> {
    await page.waitForSelector('.products .product-item');

    const products = await page.$$eval('.products .product-item', (elements) => {
        return elements.map((element) => {
            const nameElement = element.querySelector('.product_link > h3');
            const newPriceElement = element.querySelector('.price_cart > .doubleprice > .newprice');
            const oldPriceElement = element.querySelector('.price_cart > .doubleprice > .oldprice');
            const imageElement = element.querySelector('.product-image');

            const name = nameElement?.textContent?.trim() || '';

            const newPriceText = newPriceElement?.textContent?.trim() || '';
            const [newValue, newCurrency] = newPriceText.split(' ');
            const newPrice = {
                value: parseFloat(newValue.replace(',', '.')),
                currency: newCurrency || '',
            };

            const oldPriceText = oldPriceElement?.textContent?.trim() || '';
            const [oldValue, oldCurrency] = oldPriceText.split(' ');
            const oldPrice = {
                value: parseFloat(oldValue.replace(',', '.')),
                currency: oldCurrency || '',
            };

            const image = `https://centrsvyazi.ru${imageElement?.getAttribute('style')?.match(/url\(['"]?(.*?)['"]?\)/)?.[1]}` || '';

            return {
                name,
                newPrice,
                oldPrice,
                image,
            };
        });
    });

    return products;
}
