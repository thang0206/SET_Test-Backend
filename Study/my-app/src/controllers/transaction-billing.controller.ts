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
  Transaction,
  Billing,
} from '../models';
import {TransactionRepository} from '../repositories';

export class TransactionBillingController {
  constructor(
    @repository(TransactionRepository) protected transactionRepository: TransactionRepository,
  ) { }

  @get('/transactions/{id}/billing', {
    responses: {
      '200': {
        description: 'Transaction has one Billing',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Billing),
          },
        },
      },
    },
  })
  async get(
    @param.path.string('id') id: string,
    @param.query.object('filter') filter?: Filter<Billing>,
  ): Promise<Billing> {
    return this.transactionRepository.billing(id).get(filter);
  }

  @post('/transactions/{id}/billing', {
    responses: {
      '200': {
        description: 'Transaction model instance',
        content: {'application/json': {schema: getModelSchemaRef(Billing)}},
      },
    },
  })
  async create(
    @param.path.string('id') id: typeof Transaction.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Billing, {
            title: 'NewBillingInTransaction',
            exclude: ['id'],
            optional: ['transactionId']
          }),
        },
      },
    }) billing: Omit<Billing, 'id'>,
  ): Promise<Billing> {
    return this.transactionRepository.billing(id).create(billing);
  }

  @patch('/transactions/{id}/billing', {
    responses: {
      '200': {
        description: 'Transaction.Billing PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Billing, {partial: true}),
        },
      },
    })
    billing: Partial<Billing>,
    @param.query.object('where', getWhereSchemaFor(Billing)) where?: Where<Billing>,
  ): Promise<Count> {
    return this.transactionRepository.billing(id).patch(billing, where);
  }

  @del('/transactions/{id}/billing', {
    responses: {
      '200': {
        description: 'Transaction.Billing DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.string('id') id: string,
    @param.query.object('where', getWhereSchemaFor(Billing)) where?: Where<Billing>,
  ): Promise<Count> {
    return this.transactionRepository.billing(id).delete(where);
  }
}
