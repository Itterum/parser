import { Product } from '../scrap_functions/centrsvyazi';
import { MongoClient } from 'mongodb';
import { v4 as uuidv4 } from 'uuid';

const uri = 'mongodb://mongodb:27017';
const dbName = 'productsDB';
const collectionName = 'products';

export async function writeProductsToDB(products: Product[]) {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('Успешное подключение к MongoDB');

    const db = client.db(dbName);
    const collection = db.collection(collectionName);

    for (const product of products) {
      const productWithId = {
        ...product,
        id: uuidv4(), // Генерируем уникальный идентификатор
      };

      await collection.insertOne(productWithId);
    }

    console.log('Товары успешно сохранены в базе данных.');
  } catch (err) {
    console.error('Ошибка при сохранении продуктов в базе данных:', err);
  } finally {
    await client.close();
  }
}
