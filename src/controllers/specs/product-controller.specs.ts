import {RequestBodyObject} from '@loopback/openapi-v3/src/types';
import {getModelSchemaRef} from '@loopback/rest';
import {Product} from '../../models';

export const ProductSchemaCreateService: Partial<RequestBodyObject> = {
  description: 'Service for the creation of a product.',
  required: true,
  content: {
    'application/json': {
      schema: getModelSchemaRef(Product, {
        exclude: ['id', 'companyId'],
      }),
    },
  },
};

export const ProductSchemaUpdateService: Partial<RequestBodyObject> = {
  description: 'Service for the updating of a product.',
  required: true,
  content: {
    'application/json': {
      schema: getModelSchemaRef(Product, {
        exclude: ['id'],
      }),
    },
  },
};
