import {Product} from '../../models';

export abstract class ProductContract {
  abstract createProduct(product: Partial<Product>): Promise<Product>;

  abstract getProductsByCompanyIdAndActiveCategory(
    companyId: string,
  ): Promise<Product[]>;

  abstract softDeleteProduct(productId: number): Promise<Product>;

  abstract updateProduct(
    productId: number,
    product: Partial<Product>,
  ): Promise<Product>;
}
