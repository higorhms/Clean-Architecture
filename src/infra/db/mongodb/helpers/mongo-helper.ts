import { MongoClient, Collection } from 'mongodb';

const MongoHelper = {
  mongoClient: null as MongoClient,
  uri: null as string,

  async connect(uri: string): Promise<void> {
    this.uri = uri;
    this.mongoClient = await MongoClient.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  },

  async disconnect(): Promise<void> {
    await this.mongoClient.close();
    this.mongoClient = null;
  },

  async getCollection(name: string): Promise<Collection> {
    if (!this.mongoClient?.isConnected()) {
      await this.connect(this.uri);
    }

    return this.mongoClient.db().collection(name);
  },

  map: (collection: any): any => {
    const { _id, ...collectionWithoutId } = collection;
    return { ...collectionWithoutId, id: _id };
  },
};
export default MongoHelper;
