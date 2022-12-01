import {Builder} from '../builder';
import {ProductDto} from '../../data-transfer-objects/product-dto';
import {Product} from '../../models';

export class ProductDtoBuilder extends Builder<ProductDto> {
  protected object: ProductDto;

  build(item: Product): this {
    this.object.id = item.id as number;
    this.object.code = item.code;
    this.object.name = item.name;
    this.object.description = item.description;
    this.object.quantity = item.quantity;
    this.object.brand = item.brand;
    this.object.price = item.price;
    this.object.deletedAt = item.deletedAt;

    return this;
  }

  reset(): this {
    this.object = new ProductDto();
    return this;
  }
}
