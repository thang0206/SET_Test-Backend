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
  Cart,
} from '../models';
import {ProductRepository} from '../repositories';

export class ProductCartController {
  constructor(
    @repository(ProductRepository)
    public productRepository: ProductRepository,
  ) { }

  @get('/products/{id}/cart', {
    responses: {
      '200': {
        description: 'Cart belonging to Product',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Cart)},
          },
        },
      },
    },
  })
  async getCart(
    @param.path.string('id') id: typeof Product.prototype.id,
  ): Promise<Cart> {
    return this.productRepository.cart(id);
  }
}
