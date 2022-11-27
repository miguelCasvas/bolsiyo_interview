import {get, getModelSchemaRef, post, requestBody} from '@loopback/rest';

import {Company} from '../models';
import {repository} from '@loopback/repository';
import {CompanyRepository} from '../repositories';

export class CompanyController {
  constructor(
    @repository(CompanyRepository) private companyRepo: CompanyRepository,
  ) {
  }

  @get('/companies')
  async get(): Promise<Company[]> {
    return this.companyRepo.find();
  }


  @post('/companies')
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Company, {
            exclude: ['id'],
          }),
        },
      },
    }) company: Omit<Company, 'id'>,
  ): Promise<Company> {
    try {
      return await this.companyRepo.create(company);
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}
