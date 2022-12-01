import {
  Count,
  CountSchema,
  Filter,
  repository,
  Where,
} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  getWhereSchemaFor,
  param,
  patch,
  post,
  requestBody,
} from '@loopback/rest';
import {
  Billing,
  Product,
} from '../models';
import {BillingRepository} from '../repositories';

export class BillingProductController {
  constructor(
    @repository(BillingRepository) protected billingRepository: BillingRepository,
  ) { }

  @get('/billings/{id}/products', {
    responses: {
      '200': {
        description: 'Array of Billing has many Product',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Product)},
          },
        },
      },
    },
  })
  async find(
    @param.path.string('id') id: string,
    @param.query.object('filter') filter?: Filter<Product>,
  ): Promise<Product[]> {
    return this.billingRepository.products(id).find(filter);
  }

  @post('/billings/{id}/products', {
    responses: {
      '200': {
        description: 'Billing model instance',
        content: {'application/json': {schema: getModelSchemaRef(Product)}},
      },
    },
  })
  async create(
    @param.path.string('id') id: typeof Billing.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Product, {
            title: 'NewProductInBilling',
            exclude: ['id'],
            optional: ['billingId']
          }),
        },
      },
    }) product: Omit<Product, 'id'>,
  ): Promise<Product> {
    return this.billingRepository.products(id).create(product);
  }

  @patch('/billings/{id}/products', {
    responses: {
      '200': {
        description: 'Billing.Product PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Product, {partial: true}),
        },
      },
    })
    product: Partial<Product>,
    @param.query.object('where', getWhereSchemaFor(Product)) where?: Where<Product>,
  ): Promise<Count> {
    return this.billingRepository.products(id).patch(product, where);
  }

  @del('/billings/{id}/products', {
    responses: {
      '200': {
        description: 'Billing.Product DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.string('id') id: string,
    @param.query.object('where', getWhereSchemaFor(Product)) where?: Where<Product>,
  ): Promise<Count> {
    return this.billingRepository.products(id).delete(where);
  }
}
