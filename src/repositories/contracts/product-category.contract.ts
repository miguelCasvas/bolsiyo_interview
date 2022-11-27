import {ProductCategory} from '../../models';

export abstract class ProductCategoryContract {
  abstract createCategory(category: Partial<ProductCategory>): Promise<ProductCategory>

  abstract getActivateCategories(): Promise<ProductCategory[]>
}
