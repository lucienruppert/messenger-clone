import { test, expect } from 'vitest';
import { MongoClient } from 'mongodb';

const uri =
  'mongodb+srv://luciendelmar:w77us2H1fyguW1gJ@cluster0.c0bviof.mongodb.net/?retryWrites=true&w=majority';

test('connect to MongoDB Atlas database', async () => {
  const client = new MongoClient(uri);
  await client.connect();
  expect(client.db()).not.toBeNull();
  await client.close();
});
