import {belongsTo, Entity, hasMany, model, property} from '@loopback/repository';
import {Product} from './product.model';
import {Transaction} from './transaction.model';

@model({settings: {strict: false}})
export class Billing extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  id?: string;

  @property({
    type: 'number',
    required: true,
  })
  totalPrice: number;

  @property({
    type: 'string',
    required: true,
  })
  payment: string;

  @property({
    type: 'date',
  })
  createAt?: string;

  @property({
    type: 'date',
  })
  updateAt?: string;

  @hasMany(() => Product)
  products: Product[];

  @belongsTo(() => Transaction)
  transactionId: string;
  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<Billing>) {
    super(data);
  }
}

export interface BillingRelations {
  // describe navigational properties here
}

export type BillingWithRelations = Billing & BillingRelations;
