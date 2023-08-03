import { Page } from 'playwright';
import { Parser, ParsingConfig } from './parse_page';

type Price = {
    value: number;
    currency: string;
}

export interface Product {
    name: string;
    newPrice: Price;
    oldPrice: Price;
    image: string;
}

export const productConfig: ParsingConfig = {
    waitingSelector: '.products .product-item',
    nameElement: '.product_link > h3',
    newPriceElement: '.price_cart > .doubleprice > .newprice',
    oldPriceElement: '.price_cart > .doubleprice > .oldprice',
    imageElement: '.product-image'
};

export class ProductParser implements Parser<Product> {
    async parsePage(page: Page, config: ParsingConfig): Promise<Product[]> {
        await page.waitForSelector(config.waitingSelector);

        return await page.$$eval(config.waitingSelector, (elements, config) => {
            return elements.map((element) => {
                const nameElement = element.querySelector(config.nameElement);
                const newPriceElement = element.querySelector(config.newPriceElement);
                const oldPriceElement = element.querySelector(config.oldPriceElement);
                const imageElement = element.querySelector(config.imageElement);

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
        }, config); // Передаем config после функции
    }
}
