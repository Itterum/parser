import { Mem } from './mems';
import { MongoClient } from 'mongodb';
import { v4 as uuidv4 } from 'uuid';

const uri = 'mongodb://mongodb:27017';
const dbName = 'memsDB';
const collectionName = 'mems';

export async function writeMemsToDB(mems: Mem[]) {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('Успешное подключение к MongoDB');

    const db = client.db(dbName);
    const collection = db.collection(collectionName);

    for (const mem of mems) {
      const memWithId = {
        ...mem,
        id: uuidv4(),
      };

      await collection.insertOne(memWithId);
    }

    console.log('Мемы успешно сохранены в базе данных.');
  } catch (err) {
    console.error('Ошибка при сохранении мемов в базе данных:', err);
  } finally {
    await client.close();
  }
}

export async function getMemFromDB() {
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

export async function deleteMemFromDB(oldestRecord: any) {
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
