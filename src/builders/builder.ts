export abstract class Builder<T> {
  protected abstract object:T;

  public abstract reset(): this;

  public abstract build(...item: any): this;

  constructor() {
    this.reset();
  }

  public getObject(): T {
    const result = this.object;
    this.reset();

    return result;
  }
}
