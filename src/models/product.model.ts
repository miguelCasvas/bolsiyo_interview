import {belongsTo, Entity, model, property} from '@loopback/repository';
import {ProductCategory} from './product-category.model';
import {Company} from './company.model';

@model({
  name: 'products',
  settings: {
    foreignKeys: {
      // eslint-disable-next-line @typescript-eslint/naming-convention
      fk_products_product_categories_id: {
        name: 'fk_product_product_categoriesId',
        entity: ProductCategory,
        entityKey: 'id',
        foreignKey: 'productCategoryId',
      },
      // eslint-disable-next-line @typescript-eslint/naming-convention
      fk_products_companies_id: {
        name: 'fk_product_companiesId',
        entity: Company,
        entityKey: 'id',
        foreignKey: 'companyId',
      },
    },
  },
})
export class Product extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id?: number;

  @property({
    type: 'string',
    required: true,
    jsonSchema: {
      maxLength: 10,
      minLength: 4,
      pattern: "^[a-zA-Z0-9 ]{2,20}$"
    },
  })
  code: string;

  @property({
    type: 'string',
    required: true,
    jsonSchema: {
      minLength: 4,
    },
  })
  name: string;

  @property({
    type: 'string',
    required: true,
  })
  description: string;

  @property({
    type: 'string',
    required: true,
  })
  brand: string;

  @belongsTo(
    () => ProductCategory,
    {
      keyFrom: 'productCategoryId',
      keyTo: 'id'
    },
    {
      type: 'number',
      required: true,
      mysql: {
        columnName: 'product_categories_id',
      },
      limit: 255,
  })
  productCategoryId: number;

  @property({
    type: 'number',
    required: true,
  })
  quantity: number;

  @property({
    type: 'number',
    required: true,
  })
  price: number;

  @belongsTo(
    () => Company,
    {
      keyFrom: 'companyId',
      keyTo: 'id'
    },
    {
      type: 'string',
      required: true,
      defaultFn: 'uuidv4',
      mysql: {
        columnName: 'companies_id',
      },
      limit: 255,
    })
  companyId: string;

  @property({
    type: 'date',
    mysql: {
      columnName: 'deleted_at',
    }
  })
  deletedAt: string;

  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<Product>) {
    super(data);
  }
}

export interface ProductRelations {
  // describe navigational properties here
}

export type ProductWithRelations = Product & ProductRelations;
