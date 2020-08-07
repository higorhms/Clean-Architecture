import { MongoClient, Collection } from 'mongodb';
import { AccountModel } from '../../../../domain/models/account';

const MongoHelper = {
  mongoClient: null as MongoClient,

  async connect(uri: string): Promise<void> {
    this.mongoClient = await MongoClient.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  },

  async disconnect(): Promise<void> {
    await this.mongoClient.close();
  },

  getCollection(name: string): Collection {
    return this.mongoClient.db().collection(name);
  },

  map: (collection: any): any => {
    const { _id, ...collectionWithoutId } = collection;
    return { ...collectionWithoutId, id: _id };
  },
};
export default MongoHelper;
