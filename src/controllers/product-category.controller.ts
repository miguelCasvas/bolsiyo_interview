import {repository} from '@loopback/repository';
import {ProductCategoryRepository} from '../repositories';
import {get, getModelSchemaRef, post, requestBody} from '@loopback/rest';
import {ProductCategory} from '../models';

export class ProductCategoryController {
  constructor(
    @repository(ProductCategoryRepository) private categoryRepo: ProductCategoryRepository,
  ) {
  }

  @get('/categories')
  async get(): Promise<ProductCategory[]> {
    return this.categoryRepo.getActivateCategories();
  }

  @post('/categories')
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(ProductCategory, {
            exclude: ['id'],
          }),
        },
      },
    }) category: Omit<ProductCategory, 'id'>,
  ): Promise<ProductCategory> {
    try {
      return await this.categoryRepo.createCategory(category);
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}
