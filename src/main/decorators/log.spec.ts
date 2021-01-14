import { LogControllerDecorator } from './log';
import { Controller } from '../../presentation/protocols';
import { serverError } from '../../presentation/helpers/http/http-helper';
import { ILogErrorRepository } from '../../data/protocols/db/log-error-repository';

let logController: LogControllerDecorator;

const makeLogErrorRepository = (): ILogErrorRepository => {
  class LogErrorRepositoryStub implements ILogErrorRepository {
    async logError(_: string): Promise<void> {
      return Promise.resolve();
    }
  }
  return new LogErrorRepositoryStub();
};

const mockedConroller: Controller = {
  handle: () =>
    Promise.resolve({ body: { name: 'valid_name' }, statusCode: 200 }),
};

let logErrorRepository: ILogErrorRepository;

describe('LogController Decorator', () => {
  beforeAll(() => {
    logErrorRepository = makeLogErrorRepository();
    logController = new LogControllerDecorator(
      mockedConroller,
      logErrorRepository,
    );
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

  it('Shoud call logErrorRepository with correct error if controller returns a server error', async () => {
    jest
      .spyOn(mockedConroller, 'handle')
      .mockReturnValueOnce(
        Promise.resolve(
          serverError(
            Object.assign(new Error(), { stack: 'any_stack' } as Error),
          ),
        ),
      );

    const logSpy = jest.spyOn(logErrorRepository, 'logError');

    await logController.handle({ body: {} });

    expect(logSpy).toHaveBeenCalledWith('any_stack');
  });
});
