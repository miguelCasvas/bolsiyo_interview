import {ProductCategory} from '../../models';

export abstract class ProductCategoryContract {
  abstract createCategory(
    category: Partial<ProductCategory>,
  ): Promise<ProductCategory>;

  abstract getActivateCategories(): Promise<ProductCategory[]>;

  abstract getAllCategories(): Promise<ProductCategory[]>;

  abstract updateStatus(
    categoryId: number,
    status: boolean,
  ): Promise<ProductCategory>;

  abstract existProductCategoryByNameAndCode(
    code: string,
    name: string,
  ): Promise<boolean>;
}
