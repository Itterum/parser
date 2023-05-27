import { chromium, Page } from 'playwright';
import { Database } from 'sqlite3';

interface Price {
    value: number;
    currency: string;
}

interface Product {
    name: string;
    newPrice: Price;
    oldPrice: Price;
    image: string;
}

const createProductTable = `
    CREATE TABLE IF NOT EXISTS products (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        newPriceValue REAL,
        newPriceCurrency TEXT,
        oldPriceValue REAL,
        oldPriceCurrency TEXT,
        image TEXT
    )
`;

async function parsePage(page: Page): Promise<Product[]> {
    // Ожидаем появления списка товаров на странице
    await page.waitForSelector('.products .product-item');

    // Получаем список товаров
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

async function run() {
    const db = new Database('./products.db');
    let products;

    // Создание таблицы, если она не существует
    db.exec(createProductTable);

    const browser = await chromium.launch();
    const page = await browser.newPage();

    await page.goto('https://centrsvyazi.ru/catalog/phones/apple');


    products = await parsePage(page);

    // Сохранение каждого продукта в базу данных
    for (const product of products) {
        db.run(
            `INSERT INTO products (name, newPriceValue, newPriceCurrency, oldPriceValue, oldPriceCurrency, image) VALUES (?, ?, ?, ?, ?, ?)`,
            [product.name, product.newPrice.value, product.newPrice.currency, product.oldPrice.value, product.oldPrice.currency, product.image],
            (err) => {
                if (err) {
                    console.error('Ошибка при сохранении продукта в базе данных:', err);
                }
            }
        );
    }

    console.log('Товары успешно сохранены в базе данных.');

    await browser.close();
    db.close();
}

run();
