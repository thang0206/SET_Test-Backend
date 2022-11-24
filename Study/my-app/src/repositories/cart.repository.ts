import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, BelongsToAccessor} from '@loopback/repository';
import {DbDataSource} from '../datasources';
import {Cart, CartRelations, User} from '../models';
import {UserRepository} from './user.repository';

export class CartRepository extends DefaultCrudRepository<
  Cart,
  typeof Cart.prototype.id,
  CartRelations
> {

  public readonly user: BelongsToAccessor<User, typeof Cart.prototype.id>;

  constructor(
    @inject('datasources.db') dataSource: DbDataSource, @repository.getter('UserRepository') protected userRepositoryGetter: Getter<UserRepository>,
  ) {
    super(Cart, dataSource);
    this.user = this.createBelongsToAccessorFor('user', userRepositoryGetter,);
    this.registerInclusionResolver('user', this.user.inclusionResolver);
  }
}
