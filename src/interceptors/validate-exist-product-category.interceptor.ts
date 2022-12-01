import {
  /* inject, */
  injectable,
  Interceptor,
  InvocationContext,
  InvocationResult,
  Provider,
  ValueOrPromise,
} from '@loopback/core';
import {ValidationError} from '../exceptions/validation-error';
import {ProductCategoryRepository} from '../repositories';
import {repository} from '@loopback/repository';

/**
 * This class will be bound to the application as an `Interceptor` during
 * `boot`
 */
@injectable({tags: {key: ValidateExistProductCategoryInterceptor.BINDING_KEY}})
export class ValidateExistProductCategoryInterceptor implements Provider<Interceptor> {
  static readonly BINDING_KEY = `interceptors.${ValidateExistProductCategoryInterceptor.name}`;

  constructor(@repository(ProductCategoryRepository) private categoryRepo: ProductCategoryRepository) {
  }

  /**
   * This method is used by LoopBack context to produce an interceptor function
   * for the binding.
   *
   * @returns An interceptor function
   */
  value() {
    return this.intercept.bind(this);
  }

  /**
   * The logic to intercept an invocation
   * @param invocationCtx - Invocation context
   * @param next - A function to invoke next interceptor or the target method
   */
  async intercept(
    invocationCtx: InvocationContext,
    next: () => ValueOrPromise<InvocationResult>,
  ) {
    try {
      const code = invocationCtx.args[0].code;
      const name = invocationCtx.args[0].name;

      const registerExist = await this.categoryRepo.existProductCategoryByNameAndCode(code, name);
      if (registerExist) {
        const err: ValidationError = new ValidationError('This category is already registered');
        err.statusCode = 422;
        throw err;
      }

      const result = await next();
      return result;
    } catch (err) {
      throw err;
    }
  }
}
