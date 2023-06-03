import { Product } from './centrsvyazi';
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
        id: uuidv4(),
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

export async function getProductFromDB() {
  const client = new MongoClient(uri);
  let result = null;

  try {
    await client.connect();
    console.log('Успешное подключение к MongoDB');

    const db = client.db(dbName);
    const collection = db.collection(collectionName);

    const deletionResult = await collection.findOne({}, { sort: { createdAt: 1 } });
    result = deletionResult;

    console.log('Самая старая запись получена из базы данных.');
  } catch (err) {
    console.error('Ошибка при получении самой старой записи из базы данных:', err);
  } finally {
    await client.close();
  }

  return result;
}

export async function deleteProductFromDB(oldestRecord: any) {
  const client = new MongoClient(uri);
  let result = null;

  try {
    await client.connect();
    console.log('Успешное подключение к MongoDB');

    const db = client.db(dbName);
    const collection = db.collection(collectionName);

    await collection.deleteOne({ _id: oldestRecord._id });

    console.log('Самая старая запись удалена из базы данных.');
  } catch (err) {
    console.error('Ошибка при удалении самой старой записи из базы данных:', err);
  } finally {
    await client.close();
  }

  return result;
}
