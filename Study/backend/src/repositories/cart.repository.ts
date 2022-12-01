import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {DatabaseDataSource} from '../datasources';
import {Cart, CartRelations} from '../models';

export class CartRepository extends DefaultCrudRepository<
  Cart,
  typeof Cart.prototype.id,
  CartRelations
> {
  constructor(
    @inject('datasources.database') dataSource: DatabaseDataSource,
  ) {
    super(Cart, dataSource);
  }
}
