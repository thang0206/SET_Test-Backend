import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, HasManyRepositoryFactory, BelongsToAccessor} from '@loopback/repository';
import {DbDataSource} from '../datasources';
import {Billing, BillingRelations, Product, Transaction} from '../models';
import {ProductRepository} from './product.repository';
import {TransactionRepository} from './transaction.repository';

export class BillingRepository extends DefaultCrudRepository<
  Billing,
  typeof Billing.prototype.id,
  BillingRelations
> {

  public readonly products: HasManyRepositoryFactory<Product, typeof Billing.prototype.id>;

  public readonly transaction: BelongsToAccessor<Transaction, typeof Billing.prototype.id>;

  constructor(
    @inject('datasources.db') dataSource: DbDataSource, @repository.getter('ProductRepository') protected productRepositoryGetter: Getter<ProductRepository>, @repository.getter('TransactionRepository') protected transactionRepositoryGetter: Getter<TransactionRepository>,
  ) {
    super(Billing, dataSource);
    this.transaction = this.createBelongsToAccessorFor('transaction', transactionRepositoryGetter,);
    this.registerInclusionResolver('transaction', this.transaction.inclusionResolver);
    this.products = this.createHasManyRepositoryFactoryFor('products', productRepositoryGetter,);
    this.registerInclusionResolver('products', this.products.inclusionResolver);
  }
}
