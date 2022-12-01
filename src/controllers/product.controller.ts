import {repository} from '@loopback/repository';
import {CompanyRepository, ProductRepository} from '../repositories';
import {get, del, param, post, requestBody, put} from '@loopback/rest';
import {Product} from '../models';
import {CompanyProductsDto} from '../data-transfer-objects/company-products-dto';
import {authenticate} from '@loopback/authentication';
import {
  ProductSchemaCreateService,
  ProductSchemaUpdateService,
} from './specs/product-controller.specs';

export class ProductController {
  constructor(
    @repository(ProductRepository) private productRepo: ProductRepository,
    @repository(CompanyRepository) private companyRepo: CompanyRepository,
  ) {}

  @post('/companies/{company_id}/products')
  @authenticate('jwt')
  async create(
    @param.path.string('company_id') companyId: string,
    @requestBody(ProductSchemaCreateService) product: Omit<Product, 'id'>,
  ): Promise<Product | null> {
    try {
      product.companyId = companyId;
      return await this.productRepo.createProduct(product);
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  @get('/companies/{company_id}/products')
  @authenticate('jwt')
  async getCompanyProducts(
    @param.path.string('company_id') companyId: string,
  ): Promise<Product[]> {
    return this.productRepo.getProductsByCompanyIdAndActiveCategory(companyId);
  }

  @get('/companies/{company_id}/with-products')
  @authenticate('jwt')
  async getCompanyWithProducts(
    @param.path.string('company_id') companyId: string,
  ): Promise<CompanyProductsDto> {
    return this.companyRepo.getCompanyWithProducts(companyId);
  }

  @del('/products/{product_id}')
  @authenticate('jwt')
  async deleteProduct(
    @param.path.string('product_id') productId: number,
  ): Promise<Product> {
    return this.productRepo.softDeleteProduct(productId);
  }

  @put('/products/{product_id}')
  @authenticate('jwt')
  updateProduct(
    @param.path.string('product_id') productId: number,
    @requestBody(ProductSchemaUpdateService) product: Omit<Product, 'id'>,
  ): Promise<Product> {
    return this.productRepo.updateProduct(productId, product);
  }
}
