import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {DbDataSource} from '../datasources';
import {Product, ProductRelations} from '../models';
import {ProductContract} from './contracts/product.contract';

export class ProductRepository extends DefaultCrudRepository<
  Product,
  typeof Product.prototype.id,
  ProductRelations
> implements ProductContract {

  private connect: DbDataSource;

  constructor(
    @inject('datasources.db') dataSource: DbDataSource,
  ) {
    super(Product, dataSource);
    this.connect = dataSource;
  }

  createProduct(product: Partial<Product>): Promise<Product> {
    let queryString = 'INSERT INTO `products` ';
    queryString += '(code, name, description, brand, product_categories_id, quantity, price, companies_id) ';
    queryString += 'VALUE (?,?,?,?,?,?,?,?);';

    const data = [
      product.code,
      product.name,
      product.description,
      product.brand,
      product.productCategoryId,
      product.quantity,
      product.price,
      product.companyId,
    ];

    return this.connect.execute(queryString, data).then(result => {
      return new Product({
        ...{
          id: result.insertId,
        },
        ...product,
      });
    });
  }

  getProductsByCompanyIdAndActiveCategory(companyId: string): Promise<Product[]> {
    let queryString = 'SELECT p.*, c.id AS company_id, c.name as company_name, c.address as company_address';
    queryString += ' FROM products AS p';
    queryString += ' INNER JOIN product_categories pc on p.product_categories_id = pc.id';
    queryString += ' INNER JOIN companies c on p.companies_id = c.id';
    queryString += ' WHERE c.id = ? AND pc.active = 1 AND p.deleted_at IS NULL';

    const filter = [companyId];

    return this.connect.execute(queryString, filter).then(result => {

      const data: Product[] = [];
      result.forEach((row: Product) => {
        const prod = new Product(row);
        prod.deletedAt = row.deleted_at
        prod.companyId = row.companies_id;

        data.push(prod);
      });

      return data;
    });
  }

  softDeleteProduct(productId: number): Promise<Product> {
    const queryString = 'UPDATE products SET deleted_at=NOW() WHERE id=?';
    const filter = [productId];

    return this.connect.execute(queryString, filter).then(result => {
      return this.findById(productId);
    });
  }

  updateProduct(productId: number, product: Partial<Product>): Promise<Product> {
    let queryString = 'UPDATE products SET';
    queryString += ' code = ?, name = ?, description = ?, brand = ?,';
    queryString += ' product_categories_id = ?, quantity = ?, price = ?, companies_id = ?';
    queryString += ' WHERE id = ? AND deleted_at IS NULL;';

    const data = [
      product.code,
      product.name,
      product.description,
      product.brand,
      product.productCategoryId,
      product.quantity,
      product.price,
      product.companyId,
      productId
    ];

    return this.connect.execute(queryString, data).then(result => {
      if (result?.affectedRows < 1) {
        throw Error(`The product with ID ${productId}} was not updated!`)
      }

      return new Product({
        ...{id: productId},
        ...product
      });
    });
  }
}
