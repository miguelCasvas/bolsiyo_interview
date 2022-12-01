import {CompanyProductsDto} from '../../data-transfer-objects/company-products-dto';

export abstract class CompanyContract {
  public abstract getCompanyWithProducts(
    companyId: string,
  ): Promise<CompanyProductsDto>;
}
