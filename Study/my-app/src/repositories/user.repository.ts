import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, HasOneRepositoryFactory, HasManyRepositoryFactory} from '@loopback/repository';
import {DbDataSource} from '../datasources';
import {User, UserRelations, Cart, Product} from '../models';
import {CartRepository} from './cart.repository';
import {ProductRepository} from './product.repository';

export class UserRepository extends DefaultCrudRepository<
  User,
  typeof User.prototype.id,
  UserRelations
> {

  public readonly cart: HasOneRepositoryFactory<Cart, typeof User.prototype.id>;

  public readonly products: HasManyRepositoryFactory<Product, typeof User.prototype.id>;

  constructor(
    @inject('datasources.db') dataSource: DbDataSource, @repository.getter('CartRepository') protected cartRepositoryGetter: Getter<CartRepository>, @repository.getter('ProductRepository') protected productRepositoryGetter: Getter<ProductRepository>,
  ) {
    super(User, dataSource);
    this.products = this.createHasManyRepositoryFactoryFor('products', productRepositoryGetter,);
    this.registerInclusionResolver('products', this.products.inclusionResolver);
    this.cart = this.createHasOneRepositoryFactoryFor('cart', cartRepositoryGetter);
    this.registerInclusionResolver('cart', this.cart.inclusionResolver);
  }
}
