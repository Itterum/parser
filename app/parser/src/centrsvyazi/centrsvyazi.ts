import { Page } from 'playwright';
import { Parser, ParsingConfig } from '../parse_page';
import { Product } from './centrsvyazi_config';

export class ProductParser implements Parser<Product> {
    async parsePage(page: Page, config: ParsingConfig): Promise<Product[]> {
        try {
            await page.waitForSelector(config.waitingSelector);

            return await page.$$eval(config.waitingSelector, (elements, config) => {
                return elements.map((element) => {
                    const name = element.querySelector(config.nameElement)?.textContent?.trim() || '';

                    const newPriceText = element.querySelector(config.newPriceElement)?.textContent?.trim() || '';
                    const [newValue, newCurrency] = newPriceText.split(/\s+/);
                    const newPrice = {
                        value: Number(newValue),
                        currency: newCurrency,
                    };

                    const oldPriceText = element.querySelector(config.oldPriceElement)?.textContent?.trim() || '';
                    const [oldValue, oldCurrency] = oldPriceText.split(/\s+/);
                    const oldPrice = {
                        value: Number(oldValue),
                        currency: oldCurrency,
                    };

                    const image = new URL(element.querySelector(config.imageElement)
                        ?.getAttribute('style')
                        ?.match(/url\(['"]?(.*?)['"]?\)/)?.[1].replace('micro_img', 'medium_img') ?? '', 'https://centrsvyazi.ru').href;

                    const url = new URL(element.querySelector(config.productLink)
                        ?.getAttribute('href') ?? '', 'https://centrsvyazi.ru').href;

                    return {
                        name,
                        newPrice,
                        oldPrice,
                        image,
                        url
                    };
                });
            }, config);
        } catch (error) {
            console.error(error);
            return [];
        }
    }
}
