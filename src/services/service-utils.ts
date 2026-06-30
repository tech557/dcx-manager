import { reportError } from './error-reporter.service';

export const withServiceErrorHandler = <TArgs extends unknown[], TReturn>(
  fnName: string,
  fn: (...args: TArgs) => Promise<TReturn>,
) => {
  return async (...args: TArgs): Promise<TReturn> => {
    try {
      return await fn(...args);
    } catch (error) {
      await reportError({
        message: `${fnName} failed`,
        context: `args: ${JSON.stringify(args)}`,
        failedPayload: error instanceof Error ? error.message : String(error),
      });
      throw error;
    }
  };
};
