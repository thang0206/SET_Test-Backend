import {Entity, model, property, hasOne, hasMany} from '@loopback/repository';
import {Cart} from './cart.model';
import {Transaction} from './transaction.model';

@model()
export class User extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  id?: string;

  @property({
    type: 'string',
    required: true,
  })
  username: string;

  @property({
    type: 'string',
    required: true,
  })
  address: string;

  @property({
    type: 'string',
    required: true,
  })
  phoneNumber: string;

  @property({
    type: 'string',
    required: true,
  })
  email: string;

  @property({
    type: 'string',
    required: true,
  })
  password: string;

  @property({
    type: Array,
    itemType: 'string',
    required: false,
    default: ['customer'],
  })
  roles?: string[];

  @property({
    type: 'Date',
    default: new Date()
  })
  createdAt?: Date

  @property({
    type: 'Date',
    default: new Date()
  })
  updatedAt?: Date

  @hasOne(() => Cart)
  cart: Cart;

  @hasMany(() => Transaction)
  transactions: Transaction[];

  constructor(data?: Partial<User>) {
    super(data);
  }
}

export interface UserRelations {
  // describe navigational properties here
}

export type UserWithRelations = User & UserRelations;
