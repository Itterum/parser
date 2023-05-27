import { chromium } from 'playwright';
import { Database } from 'sqlite3';

import { parsePage } from './scrap_functions/centrsvyazi';

const createProductTable = `
    CREATE TABLE IF NOT EXISTS products (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        newPriceValue REAL,
        newPriceCurrency TEXT,
        oldPriceValue REAL,
        oldPriceCurrency TEXT,
        image TEXT
    )`;

async function run() {
    const db = new Database('./products.db');

    // Создание таблицы, если она не существует
    db.exec(createProductTable);

    const browser = await chromium.launch();
    const page = await browser.newPage();

    await page.goto('https://centrsvyazi.ru/catalog/phones/apple');

    const products = await parsePage(page);

    // Сохранение каждого продукта в базу данных
    for (const product of products) {
        db.run(`INSERT INTO products (
                    name, 
                    newPriceValue, 
                    newPriceCurrency, 
                    oldPriceValue, 
                    oldPriceCurrency, 
                    image) VALUES (?, ?, ?, ?, ?, ?)`,
            [
                product.name,
                product.newPrice.value,
                product.newPrice.currency,
                product.oldPrice.value,
                product.oldPrice.currency,
                product.image
            ],
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
