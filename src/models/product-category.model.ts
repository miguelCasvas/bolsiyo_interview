import {Entity, hasMany, model, property} from '@loopback/repository';
import {Product} from './product.model';

@model({
  name: 'product_categories',
  settings: {
    // strict: false
  },
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
  code: string;

  @property({
    type: 'string',
    required: true,
    jsonSchema: {
      minLength: 2,
    },
  })
  name: string;

  @property({
    type: 'string',
    required: true,
  })
  description: string;

  @property({
    type: 'boolean',
  })
  active: boolean;

  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  @hasMany(() => Product, {keyTo: 'productCategoryId', keyFrom: 'id'})
  products?: Product[];

  constructor(data?: Partial<ProductCategory>) {
    super(data);
  }
}

export interface ProductCategoryRelations {
  // describe navigational properties here
}

export type ProductCategoryWithRelations = ProductCategory &
  ProductCategoryRelations;
