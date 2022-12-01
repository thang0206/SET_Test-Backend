import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, HasOneRepositoryFactory, HasManyRepositoryFactory} from '@loopback/repository';
import {DatabaseDataSource} from '../datasources';
import {User, UserRelations, Cart, Transaction} from '../models';
import {CartRepository} from './cart.repository';
import {TransactionRepository} from './transaction.repository';

export type Credentials = {
  email: string;
  password: string;
}

export class UserRepository extends DefaultCrudRepository<
User,
  typeof User.prototype.id,
  UserRelations
> {

  public readonly cart: HasOneRepositoryFactory<Cart, typeof User.prototype.id>;

  public readonly transactions: HasManyRepositoryFactory<Transaction, typeof User.prototype.id>;

  constructor(
    @inject('datasources.database') dataSource: DatabaseDataSource, @repository.getter('CartRepository') protected cartRepositoryGetter: Getter<CartRepository>, @repository.getter('TransactionRepository') protected transactionRepositoryGetter: Getter<TransactionRepository>,
  ) {
    super(User, dataSource);
    this.transactions = this.createHasManyRepositoryFactoryFor('transactions', transactionRepositoryGetter,);
    this.registerInclusionResolver('transactions', this.transactions.inclusionResolver);
    this.cart = this.createHasOneRepositoryFactoryFor('cart', cartRepositoryGetter);
    this.registerInclusionResolver('cart', this.cart.inclusionResolver);
  }
}
