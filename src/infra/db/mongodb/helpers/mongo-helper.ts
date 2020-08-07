import { MongoClient, Collection } from 'mongodb';

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
};
export default MongoHelper;
