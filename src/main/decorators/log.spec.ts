import { LogControllerDecorator } from './log';
import { Controller, HttpResponse } from '../../presentation/protocols';

let logController: LogControllerDecorator;

const mockedConroller: Controller = {
  handle: () => Promise.resolve({ body: {}, statusCode: 200 }),
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
      .mockReturnValue(Promise.resolve({ body: {}, statusCode: 400 }));

    const httpResponse = await logController.handle({ body: {} });

    expect(httpResponse).toBeTruthy();
    expect(httpResponse).toHaveProperty('body');
    expect(httpResponse).toHaveProperty('statusCode');
  });
});
