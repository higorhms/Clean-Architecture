import MongoHelper from '../helpers/mongo-helper';
import { AccountMongoRepository } from './account';

let accountMongoRepository: AccountMongoRepository;

describe('Account Mongo Repository', () => {
  beforeEach(() => {
    accountMongoRepository = new AccountMongoRepository();
  });

  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL);
  });

  afterAll(async () => {
    await MongoHelper.disconnect();
  });

  it('Should return an account on success', async () => {
    const account = await accountMongoRepository.add({
      name: 'any_name',
      email: 'any_email',
      password: 'any_password',
    });

    expect(account).toBeTruthy();
    expect(account.id).toBeTruthy();
    expect(account.name).toBe('any_name');
    expect(account.email).toBe('any_email');
  });
});
