import {repository} from '@loopback/repository';
import {CompanyRepository, ProductRepository} from '../repositories';
import {get, del, getModelSchemaRef, param, post, requestBody, put} from '@loopback/rest';
import {Product} from '../models';
import {CompanyProductsDto} from '../data-transfer-objects/company-products-dto';

export class ProductController {
  constructor(
    @repository(ProductRepository) private productRepo: ProductRepository,
    @repository(CompanyRepository) private companyRepo: CompanyRepository,
  ) {}

  @post('/companies/{company_id}/products')
  async create(
    @param.path.string('company_id') companyId: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Product, {
            exclude: ['id'],
          }),
        },
      },
    }) product: Omit<Product, 'id'>,
  ): Promise<(Product) | null> {
    try {
      product.companyId = companyId;
      return await this.productRepo.createProduct(product);
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  @get('/companies/{company_id}/products')
  async getCompanyProducts(
    @param.path.string('company_id') companyId: string,
  ): Promise<Product[]>{
    return this.productRepo.getProductsByCompanyIdAndActiveCategory(companyId);
  }

  @get('/companies/{company_id}/with-products')
  async getCompanyWithProducts(
    @param.path.string('company_id') companyId: string,
  ): Promise<CompanyProductsDto>{
    return this.companyRepo.getCompanyWithProducts(companyId);
  }

  @del('/products/{product_id}')
  async deleteProduct(
    @param.path.string('product_id') productId: number,
  ): Promise<Product>{
    return this.productRepo.softDeleteProduct(productId);
  }

  @put('/products/{product_id}')
  updateProduct(
    @param.path.string('product_id') productId: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Product, {
            exclude: ['id'],
          }),
        },
      },
    }) product: Omit<Product, 'id'>,
  ): Promise<Product> {
    return this.productRepo.updateProduct(productId, product);
  }
}
