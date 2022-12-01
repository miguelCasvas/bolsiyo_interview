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
    const queryString =
      'INSERT INTO `product_categories` (`code`, `name`, `description`, `active`) VALUES  (?, ?, ?, ?)';

    const data = [
      category.code,
      category.name,
      category.description,
      Boolean(category.active)
    ];

    return this.connect.execute(queryString, data).then(result => {
      return new ProductCategory({
        ...{
          id:result.insertId
        },
        ...category
      });
    });
  }

  getActivateCategories(): Promise<ProductCategory[]> {
    const queryString = 'SELECT * FROM `product_categories` WHERE active = 1';
    return this.connect.execute(queryString, []).then(result => {
      return result;
    });
  }

  getAllCategories(): Promise<ProductCategory[]> {
    const queryString = 'SELECT * FROM `product_categories`';
    return this.connect.execute(queryString, []).then(result => {
      return result;
    });
  }

  updateStatus(categoryId: number, status: boolean): Promise<ProductCategory> {
    const queryString = 'UPDATE product_categories SET active=? WHERE id=?';
    const data = [status, categoryId];

    return this.connect.execute(queryString, data).then(result => {
      return this.findById(categoryId);
    });
  }
}
