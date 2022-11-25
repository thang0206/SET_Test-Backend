import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, BelongsToAccessor} from '@loopback/repository';
import {DbDataSource} from '../datasources';
import {Product, ProductRelations, User, Cart, Billing} from '../models';
import {UserRepository} from './user.repository';
import {CartRepository} from './cart.repository';
import {BillingRepository} from './billing.repository';

export class ProductRepository extends DefaultCrudRepository<
  Product,
  typeof Product.prototype.id,
  ProductRelations
> {

  public readonly user: BelongsToAccessor<User, typeof Product.prototype.id>;

  public readonly cart: BelongsToAccessor<Cart, typeof Product.prototype.id>;

  public readonly billing: BelongsToAccessor<Billing, typeof Product.prototype.id>;

  constructor(
    @inject('datasources.db') dataSource: DbDataSource, @repository.getter('UserRepository') protected userRepositoryGetter: Getter<UserRepository>, @repository.getter('CartRepository') protected cartRepositoryGetter: Getter<CartRepository>, @repository.getter('BillingRepository') protected billingRepositoryGetter: Getter<BillingRepository>,
  ) {
    super(Product, dataSource);
    this.billing = this.createBelongsToAccessorFor('billing', billingRepositoryGetter,);
    this.registerInclusionResolver('billing', this.billing.inclusionResolver);
    this.cart = this.createBelongsToAccessorFor('cart', cartRepositoryGetter,);
    this.registerInclusionResolver('cart', this.cart.inclusionResolver);
    this.user = this.createBelongsToAccessorFor('user', userRepositoryGetter,);
    this.registerInclusionResolver('user', this.user.inclusionResolver);
  }
}
