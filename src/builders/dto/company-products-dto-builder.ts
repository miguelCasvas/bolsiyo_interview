import {Builder} from '../builder';
import {CompanyProductsDto} from '../../data-transfer-objects/company-products-dto';
import {ProductDto} from '../../data-transfer-objects/product-dto';
import {Company, Product} from '../../models';
import {ProductDtoBuilder} from './product-dto-builder';

export class CompanyProductsDtoBuilder extends Builder<CompanyProductsDto> {
  protected object: CompanyProductsDto;

  public reset(): this {
    this.object = new CompanyProductsDto();
    return this;
  }

  public build(
    item: Company,
    add?: {
      products?: Product[];
    },
  ): this {
    this.object.id = item.id;
    this.object.name = item.name;
    this.object.address = item.address;

    this.addProducts(add?.products);
    return this;
  }

  public addProducts(products?: Product[]): this {
    if (!products) {
      return this;
    }

    const productsDTO: ProductDto[] = [];
    products.forEach((product: Product) =>
      productsDTO.push(new ProductDtoBuilder().build(product).getObject()),
    );

    this.object.products = productsDTO;
    return this;
  }
}
