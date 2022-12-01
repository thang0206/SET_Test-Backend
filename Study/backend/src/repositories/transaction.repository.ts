import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, HasOneRepositoryFactory} from '@loopback/repository';
import {DatabaseDataSource} from '../datasources';
import {Transaction, TransactionRelations, Billing} from '../models';
import {BillingRepository} from './billing.repository';

export class TransactionRepository extends DefaultCrudRepository<
  Transaction,
  typeof Transaction.prototype.id,
  TransactionRelations
> {

  public readonly billing: HasOneRepositoryFactory<Billing, typeof Transaction.prototype.id>;

  constructor(
    @inject('datasources.database') dataSource: DatabaseDataSource, @repository.getter('BillingRepository') protected billingRepositoryGetter: Getter<BillingRepository>,
  ) {
    super(Transaction, dataSource);
    this.billing = this.createHasOneRepositoryFactoryFor('billing', billingRepositoryGetter);
    this.registerInclusionResolver('billing', this.billing.inclusionResolver);
  }
}
