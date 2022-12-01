import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, HasManyRepositoryFactory} from '@loopback/repository';
import {DatabaseDataSource} from '../datasources';
import {Billing, BillingRelations, Product} from '../models';
import {ProductRepository} from './product.repository';

export class BillingRepository extends DefaultCrudRepository<
  Billing,
  typeof Billing.prototype.id,
  BillingRelations
> {

  public readonly products: HasManyRepositoryFactory<Product, typeof Billing.prototype.id>;

  constructor(
    @inject('datasources.database') dataSource: DatabaseDataSource, @repository.getter('ProductRepository') protected productRepositoryGetter: Getter<ProductRepository>,
  ) {
    super(Billing, dataSource);
    this.products = this.createHasManyRepositoryFactoryFor('products', productRepositoryGetter,);
    this.registerInclusionResolver('products', this.products.inclusionResolver);
  }
}
