import { LogControllerDecorator } from './log';
import { Controller } from '../../presentation/protocols';

let logController: LogControllerDecorator;

const mockedConroller: Controller = {
  handle: () =>
    Promise.resolve({ body: { name: 'valid_name' }, statusCode: 200 }),
};

describe('LogController Decorator', () => {
  beforeAll(() => {
    logController = new LogControllerDecorator(mockedConroller);
  });

  it('Shoud calls controller handle method', async () => {
    const handleSpy = jest.spyOn(mockedConroller, 'handle');
    await logController.handle({ body: {} });

    expect(handleSpy).toHaveBeenCalled();
    expect(handleSpy).toHaveBeenCalledWith({ body: {} });
  });

  it('Shoud returns controllers return with same values', async () => {
    jest
      .spyOn(mockedConroller, 'handle')
      .mockReturnValueOnce(Promise.resolve({ body: {}, statusCode: 400 }));

    const httpResponse = await logController.handle({ body: {} });

    expect(httpResponse).toBeTruthy();
    expect(httpResponse).toHaveProperty('body');
    expect(httpResponse).toHaveProperty('statusCode');
  });

  it('Shoud returns controllers return with same values', async () => {
    const httpResponse = await logController.handle({ body: {} });

    expect(httpResponse).toBeTruthy();
    expect(httpResponse).toEqual({
      body: { name: 'valid_name' },
      statusCode: 200,
    });
  });
});
