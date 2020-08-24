import { LogControllerDecorator } from './log';
import { Controller } from '../../presentation/protocols';

let controller: LogControllerDecorator;
const mockedConroller: Controller = {
  handle: () => Promise.resolve({ body: {}, statusCode: 200 }),
};

describe('LogController Decorator', () => {
  beforeAll(() => {
    controller = new LogControllerDecorator(mockedConroller);
  });

  it('Shoud calls controller handle method', async () => {
    const handleSpy = jest.spyOn(mockedConroller, 'handle');
    await controller.handle({ body: {} });

    expect(handleSpy).toHaveBeenCalled();
    expect(handleSpy).toHaveBeenCalledWith({ body: {} });
  });
});
