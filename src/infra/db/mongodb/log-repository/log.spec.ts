import { Collection } from 'mongodb';

import MongoHelper from '../helpers/mongo-helper';
import { LogMongoRepository } from './log';

let errorCollection: Collection;

describe('Log Mongo Repository', () => {
  beforeEach(async () => {
    errorCollection = await MongoHelper.getCollection('errors');
    await errorCollection.deleteMany({});
  });

  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL);
  });

  afterAll(async () => {
    await MongoHelper.disconnect();
  });

  it('Should create an error log on success', async () => {
    const sut = new LogMongoRepository();

    await sut.logError('any_error');

    const count = await errorCollection.countDocuments();

    expect(count).toBe(1);
  });
});
