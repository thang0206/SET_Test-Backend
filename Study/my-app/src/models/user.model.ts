import {Entity, hasMany, hasOne, model, property} from '@loopback/repository';
import {Cart} from './cart.model';
import {Product} from './product.model';

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
  email: string;

  @property({
    type: 'string',
    required: true,
  })
  password: string;

  @property({
    type: 'string',
    required: true,
  })
  name: string;

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
  })
  gender?: string;

  @property({
    type: 'string',
    default: "customer",
  })
  role?: string;

  @property({
    type: 'date',
  })
  createAt?: string;

  @property({
    type: 'date',
  })
  updateAt?: string;

  @hasOne(() => Cart)
  cart: Cart;

  @hasMany(() => Product)
  products: Product[];

  constructor(data?: Partial<User>) {
    super(data);
  }
}

export interface UserRelations {
  // describe navigational properties here
}

export type UserWithRelations = User & UserRelations;
