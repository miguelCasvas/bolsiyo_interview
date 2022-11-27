import {Entity, hasMany, model, property} from '@loopback/repository';
import {Product} from './product.model';

@model({
  name: 'product_categories',
  settings: {
    // strict: false
  }
})
export class ProductCategory extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id?: number;

  @property({
    type: 'string',
    required: true,
  })
  name: string;

  @property({
    type: 'date',
    mysql: {
      columnName: 'created_at',
    }
  })
  createdAt: string;

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

  @hasMany(() => Product, {keyTo: 'productCategoryId', keyFrom: 'id'})
  products?: Product[]

  constructor(data?: Partial<ProductCategory>) {
    super(data);
  }
}

export interface ProductCategoryRelations {
  // describe navigational properties here
}

export type ProductCategoryWithRelations = ProductCategory & ProductCategoryRelations;
