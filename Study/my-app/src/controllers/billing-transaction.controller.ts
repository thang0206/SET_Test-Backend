import {
  repository,
} from '@loopback/repository';
import {
  param,
  get,
  getModelSchemaRef,
} from '@loopback/rest';
import {
  Billing,
  Transaction,
} from '../models';
import {BillingRepository} from '../repositories';

export class BillingTransactionController {
  constructor(
    @repository(BillingRepository)
    public billingRepository: BillingRepository,
  ) { }

  @get('/billings/{id}/transaction', {
    responses: {
      '200': {
        description: 'Transaction belonging to Billing',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Transaction)},
          },
        },
      },
    },
  })
  async getTransaction(
    @param.path.string('id') id: typeof Billing.prototype.id,
  ): Promise<Transaction> {
    return this.billingRepository.transaction(id);
  }
}
