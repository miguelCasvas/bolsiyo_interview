import {repository} from '@loopback/repository';
import {ProductCategoryRepository} from '../repositories';
import {get, getModelSchemaRef, param, patch, post, requestBody} from '@loopback/rest';
import {ProductCategory} from '../models';
import {authenticate} from '@loopback/authentication';

export class ProductCategoryController {
  constructor(
    @repository(ProductCategoryRepository) private categoryRepo: ProductCategoryRepository,
  ) {
  }

  @get('/categories')
  @authenticate('jwt')
  async get(
    @param.query.boolean('not_validate_status') notValidateStatus: boolean,
  ): Promise<ProductCategory[]> {
    if (notValidateStatus) {
      return this.categoryRepo.getAllCategories();
    }

    return this.categoryRepo.getActivateCategories();
  }

  @post('/categories')
  @authenticate('jwt')
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

  @patch('/categories/{category_id}/update-status')
  @authenticate('jwt')
  async updateStatus(
    @param.path.number('category_id') categoryId: number,
    @requestBody() active: {active: boolean},
  ): Promise<ProductCategory> {
    try {
      return await this.categoryRepo.updateStatus(categoryId, active.active);
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}
