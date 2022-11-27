import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {DbDataSource} from '../datasources';
import {ProductCategory, ProductCategoryRelations} from '../models';
import {ProductCategoryContract} from './contracts/product-category.contract';

export class ProductCategoryRepository extends DefaultCrudRepository<
  ProductCategory,
  typeof ProductCategory.prototype.id,
  ProductCategoryRelations
> implements ProductCategoryContract {

  private connect: DbDataSource;

  constructor(
    @inject('datasources.db') dataSource: DbDataSource,
  ) {
    super(ProductCategory, dataSource);
    this.connect = dataSource;
  }

  createCategory(category: Partial<ProductCategory>): Promise<ProductCategory> {
    const dateTime = new Date().toISOString().slice(0, 19).replace('T', ' ');
    const queryString = 'INSERT INTO `product_categories` (`name`, `created_at`) VALUES  (?, ?)';
    const data = [category.name, dateTime];

    return this.connect.execute(queryString, data).then(result => {

      return new ProductCategory({
        ...{
          id:result.insertId,
          createdAt: dateTime
        },
        ...category
      });
    });
  }

  getActivateCategories(): Promise<ProductCategory[]> {
    const queryString = 'SELECT * FROM `product_categories` WHERE deleted_at IS NULL';
    return this.connect.execute(queryString, []).then(result => {
      return result;
    });
  }
}
