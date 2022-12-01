import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {DbDataSource} from '../datasources';
import {Company, CompanyRelations, Product} from '../models';
import {CompanyContract} from './contracts/Company-contract';
import {CompanyProductsDto} from '../data-transfer-objects/company-products-dto';
import {CompanyProductsDtoBuilder} from '../builders/dto/company-products-dto-builder';

export class CompanyRepository extends DefaultCrudRepository<
  Company,
  typeof Company.prototype.id,
  CompanyRelations
> implements CompanyContract {
  private connect: DbDataSource;

  constructor(
    @inject('datasources.db') dataSource: DbDataSource,
  ) {
    super(Company, dataSource);
    this.connect = dataSource;
  }

  getCompanyWithProducts(companyId: string): Promise<CompanyProductsDto> {
    let queryString = 'SELECT c.id AS company_id, c.name as company_name, c.address as company_address, p.*';
    queryString += ' FROM companies AS c';
    queryString += ' LEFT JOIN products p on c.id = p.companies_id AND p.deleted_at IS NULL';
    queryString += ' LEFT JOIN product_categories pc on p.product_categories_id = pc.id AND pc.active = 1';
    queryString += ' WHERE c.id = ?';

    const filter = [companyId];

    return this.connect.execute(queryString, filter).then(result => {
      const companyProductsDtoBuilder = new CompanyProductsDtoBuilder();
      if (!result.length) {
        return companyProductsDtoBuilder.getObject();
      }

      const products: Product[] = [];
      const firstRow = result[0];
      const company = new Company({
        id: firstRow.company_id,
        name: firstRow.company_name,
        address: firstRow.company_address,
      });

      result.forEach((row: Product) => {
        if (!row.id) {
          return null;
        }

        const prod = new Product({...row, ...{deletedAt: row.deleted_at, companyId: row.company_id}});
        products.push(prod);
      });

      return companyProductsDtoBuilder.build(company, {products: products}).getObject();
    });
  }
}
