import {
  repository,
} from '@loopback/repository';
import {
  param,
  get,
  getModelSchemaRef,
} from '@loopback/rest';
import {
  Product,
  Billing,
} from '../models';
import {ProductRepository} from '../repositories';

export class ProductBillingController {
  constructor(
    @repository(ProductRepository)
    public productRepository: ProductRepository,
  ) { }

  @get('/products/{id}/billing', {
    responses: {
      '200': {
        description: 'Billing belonging to Product',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Billing)},
          },
        },
      },
    },
  })
  async getBilling(
    @param.path.string('id') id: typeof Product.prototype.id,
  ): Promise<Billing> {
    return this.productRepository.billing(id);
  }
}
