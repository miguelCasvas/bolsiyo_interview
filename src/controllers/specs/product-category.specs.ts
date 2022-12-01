import {RequestBodyObject} from '@loopback/openapi-v3/src/types';
import {getModelSchemaRef} from '@loopback/rest';
import {ProductCategory} from '../../models';

export const CategorySchemaCreateService: Partial<RequestBodyObject> = {
  description: 'Service for the creation of a product category.',
  required: true,
  content: {
    'application/json': {
      schema: getModelSchemaRef(ProductCategory, {
        exclude: ['id'],
      }),
    },
  },
};
