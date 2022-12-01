import {ProductDto} from './product-dto';

export class CompanyProductsDto {
  id: string
  name: string
  address: string
  products:ProductDto[]
}
